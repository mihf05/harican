import { prisma } from '../lib/prisma.js';
import { z } from 'zod';
import nodemailer from 'nodemailer';

// Email transporter configuration
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const updateApplicationSchema = z.object({
  status: z.enum(['PENDING', 'REVIEWED', 'INTERVIEW_SCHEDULED', 'ACCEPTED', 'REJECTED', 'HIRED']),
  interviewDate: z.string().optional(),
  interviewNotes: z.string().optional(),
  rejectionReason: z.string().optional(),
});

export const applicationController = {
  // Get all applications for a job (POSTER/ADMIN only)
  async getJobApplications(req, res) {
    try {
      const { jobId } = req.params;
      const userId = req.user.id;

      // Verify job ownership
      const job = await prisma.job.findUnique({
        where: { id: jobId }
      });

      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      if (job.postedById !== userId && req.user.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to view these applications'
        });
      }

      // Get all applications with user details
      const applications = await prisma.jobApplication.findMany({
        where: { jobId },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
              educationLevel: true,
              department: true,
              experienceLevel: true,
              bio: true,
              cvText: true,
              skills: {
                select: {
                  skillName: true,
                  level: true,
                }
              }
            }
          }
        },
        orderBy: {
          appliedAt: 'desc'
        }
      });

      res.json({
        success: true,
        data: applications
      });
    } catch (error) {
      console.error('Get job applications error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch applications',
        error: error.message
      });
    }
  },

  // Get all applications for poster's jobs
  async getAllMyApplications(req, res) {
    try {
      const userId = req.user.id;

      // Get all jobs posted by this user
      const jobs = await prisma.job.findMany({
        where: { postedById: userId },
        include: {
          jobApplications: {
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                  phone: true,
                  educationLevel: true,
                  experienceLevel: true,
                  skills: {
                    select: {
                      skillName: true,
                      level: true,
                    }
                  }
                }
              }
            },
            orderBy: {
              appliedAt: 'desc'
            }
          }
        }
      });

      res.json({
        success: true,
        data: jobs
      });
    } catch (error) {
      console.error('Get all applications error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch applications',
        error: error.message
      });
    }
  },

  // Update application status
  async updateApplicationStatus(req, res) {
    try {
      const { applicationId } = req.params;
      const userId = req.user.id;
      
      const validatedData = updateApplicationSchema.parse(req.body);

      // Get application with job details
      const application = await prisma.jobApplication.findUnique({
        where: { id: applicationId },
        include: {
          job: true,
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
            }
          }
        }
      });

      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }

      // Verify job ownership
      if (application.job.postedById !== userId && req.user.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to update this application'
        });
      }

      // Update application
      const updateData = {
        status: validatedData.status,
        updatedAt: new Date(),
      };

      if (validatedData.interviewDate) {
        updateData.interviewDate = new Date(validatedData.interviewDate);
      }

      if (validatedData.interviewNotes) {
        updateData.interviewNotes = validatedData.interviewNotes;
      }

      if (validatedData.rejectionReason) {
        updateData.rejectionReason = validatedData.rejectionReason;
      }

      const updatedApplication = await prisma.jobApplication.update({
        where: { id: applicationId },
        data: updateData,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            }
          }
        }
      });

      // Send email notification based on status
      try {
        await sendStatusUpdateEmail(application, validatedData);
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // Don't fail the request if email fails
      }

      res.json({
        success: true,
        message: 'Application updated successfully',
        data: updatedApplication
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors
        });
      }

      console.error('Update application status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update application',
        error: error.message
      });
    }
  },

  // Send interview invitation email
  async sendInterviewInvitation(req, res) {
    try {
      const { applicationId } = req.params;
      const { interviewDate, interviewNotes, subject, message } = req.body;
      const userId = req.user.id;

      // Get application with details
      const application = await prisma.jobApplication.findUnique({
        where: { id: applicationId },
        include: {
          job: true,
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            }
          }
        }
      });

      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }

      // Verify job ownership - only allow job poster or admin
      const isJobPoster = application.job.postedById && application.job.postedById === userId;
      const isAdmin = req.user.role === 'ADMIN';
      
      if (!isJobPoster && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to send interview invitations'
        });
      }

      // Update application status
      await prisma.jobApplication.update({
        where: { id: applicationId },
        data: {
          status: 'INTERVIEW_SCHEDULED',
          interviewDate: interviewDate ? new Date(interviewDate) : null,
          interviewNotes: interviewNotes || '',
        }
      });

      // Send email
      if (application.user.email) {
        const transporter = createEmailTransporter();
        
        const emailSubject = subject || `Interview Invitation - ${application.job.title} at ${application.job.company}`;
        const emailBody = message || `
Dear ${application.user.fullName},

We are pleased to invite you for an interview for the position of ${application.job.title} at ${application.job.company}.

${interviewDate ? `Interview Date: ${new Date(interviewDate).toLocaleString()}` : ''}
${interviewNotes ? `\nAdditional Notes:\n${interviewNotes}` : ''}

We look forward to meeting you!

Best regards,
${application.job.company}
        `;

        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: application.user.email,
          subject: emailSubject,
          text: emailBody,
        });
      }

      res.json({
        success: true,
        message: 'Interview invitation sent successfully'
      });
    } catch (error) {
      console.error('Send interview invitation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send interview invitation',
        error: error.message
      });
    }
  },

  // Get application statistics for poster
  async getApplicationStats(req, res) {
    try {
      const userId = req.user.id;

      // Get all applications for user's jobs
      const applications = await prisma.jobApplication.findMany({
        where: {
          job: {
            postedById: userId
          }
        }
      });

      const stats = {
        total: applications.length,
        pending: applications.filter(app => app.status === 'PENDING').length,
        reviewed: applications.filter(app => app.status === 'REVIEWED').length,
        interviewScheduled: applications.filter(app => app.status === 'INTERVIEW_SCHEDULED').length,
        hired: applications.filter(app => app.status === 'HIRED').length,
        rejected: applications.filter(app => app.status === 'REJECTED').length,
      };

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Get application stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch application statistics',
        error: error.message
      });
    }
  }
};

// Helper function to send status update emails
async function sendStatusUpdateEmail(application, updateData) {
  if (!application.user.email) return;

  const transporter = createEmailTransporter();
  let subject = '';
  let message = '';

  switch (updateData.status) {
    case 'INTERVIEW_SCHEDULED':
      subject = `Interview Scheduled - ${application.job.title}`;
      message = `Dear ${application.user.fullName},\n\nYour interview has been scheduled for the position of ${application.job.title} at ${application.job.company}.\n\n${updateData.interviewDate ? `Date: ${new Date(updateData.interviewDate).toLocaleString()}` : ''}\n${updateData.interviewNotes ? `\nNotes: ${updateData.interviewNotes}` : ''}\n\nBest regards,\n${application.job.company}`;
      break;
    
    case 'HIRED':
      subject = `Congratulations! Job Offer - ${application.job.title}`;
      message = `Dear ${application.user.fullName},\n\nCongratulations! We are pleased to offer you the position of ${application.job.title} at ${application.job.company}.\n\nWe will contact you shortly with further details.\n\nBest regards,\n${application.job.company}`;
      break;
    
    case 'REJECTED':
      subject = `Application Update - ${application.job.title}`;
      message = `Dear ${application.user.fullName},\n\nThank you for your interest in the position of ${application.job.title} at ${application.job.company}.\n\nAfter careful consideration, we have decided to move forward with other candidates.\n\n${updateData.rejectionReason ? `Feedback: ${updateData.rejectionReason}` : ''}\n\nWe wish you the best in your job search.\n\nBest regards,\n${application.job.company}`;
      break;
    
    default:
      return; // Don't send email for other statuses
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: application.user.email,
      subject: subject,
      text: message,
    });
  } catch (error) {
    console.error('Email send error:', error);
  }
}
