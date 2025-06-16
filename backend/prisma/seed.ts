import { PrismaClient, BadgeTier, WorkshopStatus, ProjectDifficulty, ProjectStatus, JobStatus, JobType, DisputeStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Clearing existing data...');
  await prisma.$transaction([
    prisma.tokenReward.deleteMany(),
    prisma.disputeResolution.deleteMany(),
    prisma.vote.deleteMany(),
    prisma.dispute.deleteMany(),
    prisma.review.deleteMany(),
    prisma.userWorkshop.deleteMany(),
    prisma.contract.deleteMany(),
    prisma.application.deleteMany(),
    prisma.jobInvite.deleteMany(),
    prisma.job.deleteMany(),
    prisma.openSourceProject.deleteMany(),
    prisma.userBadge.deleteMany(),
    prisma.badge.deleteMany(),
    prisma.workshop.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  const hashedPassword = await bcrypt.hash('password123', 10);

  // 🔖 Badges with real image URLs
  const badgeData = [
    { name: 'GURU', description: 'Master of teaching with excellent reviews', tier: BadgeTier.GURU, iconUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'  },
    { name: 'SIKSHA_SEVI', description: 'Dedicated to learning and teaching', tier: BadgeTier.SIKSHA_SEVI, iconUrl: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg'  },
    { name: 'SHIKSHARTHI', description: 'Active learner in the community', tier: BadgeTier.SHIKSHARTHI, iconUrl: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg'  },
    { name: 'ACHARYA', description: 'Expert in their field with proven track record', tier: BadgeTier.ACHARYA, iconUrl: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg'  },
    { name: 'UTSAAHI_INTERN', description: 'Enthusiastic intern ready to learn', tier: BadgeTier.UTSAAHI_INTERN, iconUrl: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg'  }
  ];
  const badges = await Promise.all(badgeData.map(badge => prisma.badge.create({ data: badge })));

  // 👤 Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@chalkbox.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
      bio: 'Platform administrator',
      skills: ['JavaScript', 'TypeScript', 'Node.js', 'React', 'MongoDB'],
      tokens: 1000,
      profilePic: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg' 
    }
  });

  // 👨‍💼 Tech Employer (Main Employer)
  const techEmployer = await prisma.user.create({
    data: {
      email: 'employer@chalkbox.com',
      password: hashedPassword,
      name: 'Tech Employer',
      role: 'EMPLOYER',
      bio: 'Senior tech lead with 10+ years experience in full-stack development and cloud architecture',
      skills: ['System Design', 'Architecture', 'Team Leadership', 'AWS', 'React', 'Node.js'],
      tokens: 500,
      profilePic: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
      badges: { 
        create: [
          { badgeId: badges[0].id }, // GURU badge
          { badgeId: badges[3].id }  // ACHARYA badge
        ]
      }
    }
  });

  // 👩‍🎓 Ram Sharma (Main Student)
  const ramSharma = await prisma.user.create({
    data: {
      email: 'ram@chalkbox.com',
      password: hashedPassword,
      name: 'Ram Sharma',
      role: 'STUDENT',
      bio: 'Passionate full-stack developer with focus on React and Node.js. Completed multiple workshops and actively contributing to open source.',
      skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS'],
      tokens: 250,
      profilePic: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      badges: { 
        create: [
          { badgeId: badges[1].id }, // SIKSHA_SEVI badge
          { badgeId: badges[2].id }  // SHIKSHARTHI badge
        ]
      }
    }
  });

  // Other students for variety
  const otherStudents = await Promise.all([
    prisma.user.create({
      data: {
        email: 'sita@chalkbox.com',
        password: hashedPassword,
        name: 'Sita Thapa',
        role: 'STUDENT',
        bio: 'Frontend developer in training',
        skills: ['HTML', 'CSS', 'JavaScript', 'React'],
        tokens: 50,
        profilePic: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
        badges: { create: { badgeId: badges[4].id } }
      }
    }),
    prisma.user.create({
      data: {
        email: 'hari@chalkbox.com',
        password: hashedPassword,
        name: 'Hari Karki',
        role: 'STUDENT',
        bio: 'Python enthusiast',
        skills: ['Python', 'Django', 'SQL'],
        tokens: 75,
        profilePic: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg',
        badges: { create: { badgeId: badges[4].id } }
      }
    })
  ]);

  // 🎓 Workshops (Hosted by Tech Employer)
  const workshops = await Promise.all([
    // Completed Workshop
    prisma.workshop.create({
      data: {
        title: 'Advanced React Patterns',
        description: 'Master advanced React concepts and patterns for production applications.',
        zoomLink: 'https://zoom.us/j/123456789',
        price: 49.99,
        tokensEarned: 50,
        skillsTaught: ['React', 'TypeScript', 'Performance'],
        status: WorkshopStatus.COMPLETED,
        startDate: new Date(Date.now() - 45 * 86400000),
        endDate: new Date(Date.now() - 38 * 86400000),
        totalSeats: 30,
        outcomes: ['Master advanced hooks', 'Optimize React performance', 'Build scalable components'],
        rules: ['Strong React fundamentals required', 'Bring your own laptop'],
        hostId: techEmployer.id,
        attendees: {
          create: [
            { userId: ramSharma.id },
            { userId: otherStudents[0].id }
          ]
        }
      }
    }),
    // Ongoing Workshop
    prisma.workshop.create({
      data: {
        title: 'Full Stack Development with MERN',
        description: 'Comprehensive MERN stack development workshop.',
        zoomLink: 'https://zoom.us/j/987654321',
        price: 69.99,
        tokensEarned: 60,
        skillsTaught: ['MongoDB', 'Express', 'React', 'Node.js'],
        status: WorkshopStatus.ONGOING,
        startDate: new Date(Date.now() - 7 * 86400000),
        endDate: new Date(Date.now() + 14 * 86400000),
        totalSeats: 25,
        outcomes: ['Build full-stack applications', 'Implement authentication', 'Deploy to cloud'],
        rules: ['Basic JavaScript knowledge required', 'GitHub account needed'],
        hostId: techEmployer.id,
        attendees: {
          create: [
            { userId: ramSharma.id },
            { userId: otherStudents[1].id }
          ]
        }
      }
    }),
    // Upcoming Workshop
    prisma.workshop.create({
      data: {
        title: 'Cloud Architecture with AWS',
        description: 'Learn cloud architecture and deployment with AWS.',
        zoomLink: 'https://zoom.us/j/555555555',
        price: 79.99,
        tokensEarned: 70,
        skillsTaught: ['AWS', 'Cloud Architecture', 'DevOps'],
        status: WorkshopStatus.UPCOMING,
        startDate: new Date(Date.now() + 14 * 86400000),
        endDate: new Date(Date.now() + 28 * 86400000),
        totalSeats: 20,
        outcomes: ['Design cloud architecture', 'Deploy scalable applications', 'Implement CI/CD'],
        rules: ['AWS account required', 'Basic networking knowledge'],
        hostId: techEmployer.id
      }
    })
  ]);

  // 📝 Reviews for completed workshops
  await prisma.review.createMany({
    data: [
      {
        rating: 5,
        comment: 'Excellent workshop! The advanced patterns were explained very clearly.',
        reviewerId: ramSharma.id,
        workshopId: workshops[0].id
      },
      {
        rating: 4,
        comment: 'Great content and practical examples. Could use more hands-on exercises.',
        reviewerId: otherStudents[0].id,
        workshopId: workshops[0].id
      }
    ]
  });

  // 💼 Jobs posted by Tech Employer
  const jobs = await Promise.all([
    // Active Job
    prisma.job.create({
      data: {
        title: 'Senior Full Stack Developer',
        subtitle: 'Lead development of enterprise applications',
        description: 'Looking for an experienced full-stack developer to lead our enterprise application development...',
        requiredSkills: ['React', 'Node.js', 'TypeScript', 'AWS'],
        tags: ['Senior', 'Full Stack', 'Leadership'],
        type: JobType.FULL_TIME,
        location: 'Remote',
        locationType: 'Remote',
        budget: 'NPR 200,000',
        status: JobStatus.OPEN,
        isVerified: true,
        postedTime: '2 days ago',
        proposals: 5,
        aiMatch: 0.85,
        employerId: techEmployer.id
      }
    }),
    // Job with Active Contract
    prisma.job.create({
      data: {
        title: 'React Developer Intern',
        subtitle: 'Learn and grow with our experienced team',
        description: 'Exciting internship opportunity for React developers...',
        requiredSkills: ['React', 'JavaScript', 'HTML', 'CSS'],
        tags: ['Internship', 'Frontend', 'React'],
        type: JobType.INTERNSHIP,
        location: 'Kathmandu',
        locationType: 'Hybrid',
        budget: 'NPR 25,000',
        status: JobStatus.CLOSED,
        isVerified: true,
        postedTime: '1 month ago',
        proposals: 15,
        aiMatch: 0.92,
        employerId: techEmployer.id,
        applications: {
          create: {
            studentId: ramSharma.id,
            proposal: 'I have completed multiple React workshops and built several projects...',
            status: 'ACCEPTED'
          }
        },
        contracts: {
          create: {
            studentId: ramSharma.id,
            employerId: techEmployer.id,
            agreementHash: 'active-contract-hash-123',
            status: 'ACTIVE',
            blockchainHash: 'blockchain-hash-123',
            transactionHash: 'tx-hash-123'
          }
        }
      }
    }),
    // Job with Completed Contract
    prisma.job.create({
      data: {
        title: 'Node.js Backend Developer',
        subtitle: 'Build scalable backend services',
        description: 'Looking for a Node.js developer to build and maintain our backend services...',
        requiredSkills: ['Node.js', 'Express', 'MongoDB', 'TypeScript'],
        tags: ['Backend', 'Node.js', 'Full-time'],
        type: JobType.FULL_TIME,
        location: 'Remote',
        locationType: 'Remote',
        budget: 'NPR 150,000',
        status: JobStatus.CLOSED,
        isVerified: true,
        postedTime: '3 months ago',
        proposals: 20,
        aiMatch: 0.88,
        employerId: techEmployer.id,
        applications: {
          create: {
            studentId: ramSharma.id,
            proposal: 'I have extensive experience with Node.js and MongoDB...',
            status: 'ACCEPTED'
          }
        },
        contracts: {
          create: {
            studentId: ramSharma.id,
            employerId: techEmployer.id,
            agreementHash: 'completed-contract-hash-456',
            status: 'COMPLETED',
            blockchainHash: 'blockchain-hash-456',
            transactionHash: 'tx-hash-456',
            completedAt: new Date(Date.now() - 30 * 86400000),
            employerCompleted: true,
            studentCompleted: true,
            completionNote: 'Project completed successfully'
          }
        }
      }
    })
  ]);

  // 🌐 Open Source Projects
  const openSourceProjects = await Promise.all([
    prisma.openSourceProject.create({
      data: {
        title: 'React Component Library',
        description: 'Modern component library built with React and TypeScript',
        fullDescription: 'Comprehensive reusable components using modern practices...',
        techStack: ['React', 'TypeScript', 'Storybook', 'Jest'],
        difficulty: 'INTERMEDIATE',
        goals: ['Create reusable components', 'Implement testing', 'Write documentation'],
        githubUrl: 'https://github.com/example/react-components',
        hiringLabel: 'good first issue',
        contributionGuidelines: 'Please read contributing guidelines...',
        goodFirstIssues: ['Add unit tests', 'Improve docs', 'Fix accessibility'],
        employerId: techEmployer.id,
        status: ProjectStatus.OPEN
      }
    }),
    prisma.openSourceProject.create({
      data: {
        title: 'Node.js API Framework',
        description: 'Lightweight API framework for Node.js',
        fullDescription: 'Framework for building scalable APIs with Node.js...',
        techStack: ['Node.js', 'TypeScript', 'Express', 'MongoDB'],
        difficulty: 'ADVANCED',
        goals: ['Build core framework', 'Add middleware support', 'Create documentation'],
        githubUrl: 'https://github.com/example/node-api-framework',
        hiringLabel: 'help wanted',
        contributionGuidelines: 'Follow our coding standards...',
        goodFirstIssues: ['Add authentication middleware', 'Create API documentation', 'Add validation'],
        employerId: techEmployer.id,
        status: ProjectStatus.OPEN
      }
    })
  ]);

  // ⚖️ Disputes
  const disputes = await Promise.all([
    // Open Dispute
    prisma.dispute.create({
      data: {
        reason: 'Payment not received for completed work',
        evidence: 'Contract agreement and completion proof',
        blockchainHash: 'open-dispute-hash-111',
        status: DisputeStatus.OPEN,
        raisedById: ramSharma.id,
        contractId: (await prisma.contract.findFirst({ where: { status: 'COMPLETED' } }))?.id || ''
      }
    }),
    // Responded Dispute
    prisma.dispute.create({
      data: {
        reason: 'Quality of work not meeting standards',
        evidence: 'Code review and performance metrics',
        blockchainHash: 'responded-dispute-hash-222',
        status: DisputeStatus.RESPONDED,
        raisedById: techEmployer.id,
        respondedById: ramSharma.id,
        response: 'I have completed all tasks as per the contract requirements',
        contractId: (await prisma.contract.findFirst({ where: { status: 'ACTIVE' } }))?.id || ''
      }
    })
  ]);

  // Add votes to disputes
  await prisma.vote.createMany({
    data: [
      {
        disputeId: disputes[0].id,
        voterId: otherStudents[0].id,
        votedForId: ramSharma.id
      },
      {
        disputeId: disputes[0].id,
        voterId: otherStudents[1].id,
        votedForId: techEmployer.id
      }
    ]
  });

  // Add dispute resolution
  await prisma.disputeResolution.create({
    data: {
      disputeId: disputes[0].id,
      winnerId: ramSharma.id,
      resolverId: admin.id
    }
  });

  // Add token rewards
  await prisma.tokenReward.createMany({
    data: [
      {
        userId: ramSharma.id,
        amount: 50,
        reason: 'Won dispute resolution',
        disputeId: disputes[0].id
      },
      {
        userId: techEmployer.id,
        amount: 30,
        reason: 'Completed workshop hosting',
        disputeId: null
      }
    ]
  });

  // Add job invites
  await prisma.jobInvite.createMany({
    data: [
      {
        jobId: jobs[0].id,
        studentId: ramSharma.id,
        employerId: techEmployer.id,
        status: 'PENDING'
      },
      {
        jobId: jobs[0].id,
        studentId: otherStudents[0].id,
        employerId: techEmployer.id,
        status: 'ACCEPTED'
      }
    ]
  });

  // Add more diverse students with different skill levels and backgrounds
  const additionalStudents = await Promise.all([
    prisma.user.create({
      data: {
        email: 'anita@chalkbox.com',
        password: hashedPassword,
        name: 'Anita Shrestha',
        role: 'STUDENT',
        bio: 'Data Science enthusiast with focus on ML and AI',
        skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Analysis', 'SQL'],
        tokens: 180,
        profilePic: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
        badges: { 
          create: [
            { badgeId: badges[1].id }, // SIKSHA_SEVI
            { badgeId: badges[2].id }  // SHIKSHARTHI
          ]
        }
      }
    }),
    prisma.user.create({
      data: {
        email: 'bikram@chalkbox.com',
        password: hashedPassword,
        name: 'Bikram Thapa',
        role: 'STUDENT',
        bio: 'Mobile app developer specializing in React Native',
        skills: ['React Native', 'JavaScript', 'Redux', 'Firebase', 'iOS', 'Android'],
        tokens: 220,
        profilePic: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
        badges: { create: { badgeId: badges[3].id } } // ACHARYA
      }
    }),
    prisma.user.create({
      data: {
        email: 'deepika@chalkbox.com',
        password: hashedPassword,
        name: 'Deepika Karki',
        role: 'STUDENT',
        bio: 'DevOps engineer with cloud expertise',
        skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Linux'],
        tokens: 150,
        profilePic: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
        badges: { create: { badgeId: badges[4].id } } // UTSAAHI_INTERN
      }
    })
  ]);

  // Add more workshops with different topics and states
  const additionalWorkshops = await Promise.all([
    prisma.workshop.create({
      data: {
        title: 'Machine Learning Fundamentals',
        description: 'Introduction to ML concepts and practical applications',
        zoomLink: 'https://zoom.us/j/111222333',
        price: 59.99,
        tokensEarned: 55,
        skillsTaught: ['Python', 'Machine Learning', 'Data Analysis'],
        status: WorkshopStatus.COMPLETED,
        startDate: new Date(Date.now() - 60 * 86400000),
        endDate: new Date(Date.now() - 53 * 86400000),
        totalSeats: 25,
        outcomes: ['Understand ML basics', 'Build simple ML models', 'Data preprocessing'],
        rules: ['Python knowledge required', 'Basic math background'],
        hostId: techEmployer.id,
        attendees: {
          create: [
            { userId: additionalStudents[0].id },
            { userId: ramSharma.id }
          ]
        }
      }
    }),
    prisma.workshop.create({
      data: {
        title: 'Mobile App Development with React Native',
        description: 'Build cross-platform mobile apps using React Native',
        zoomLink: 'https://zoom.us/j/444555666',
        price: 69.99,
        tokensEarned: 65,
        skillsTaught: ['React Native', 'JavaScript', 'Mobile Development'],
        status: WorkshopStatus.ONGOING,
        startDate: new Date(Date.now() - 14 * 86400000),
        endDate: new Date(Date.now() + 7 * 86400000),
        totalSeats: 20,
        outcomes: ['Build mobile apps', 'Handle native features', 'App deployment'],
        rules: ['React knowledge required', 'Android Studio/Xcode installed'],
        hostId: techEmployer.id,
        attendees: {
          create: [
            { userId: additionalStudents[1].id },
            { userId: otherStudents[0].id }
          ]
        }
      }
    }),
    prisma.workshop.create({
      data: {
        title: 'DevOps and Cloud Architecture',
        description: 'Master cloud infrastructure and DevOps practices',
        zoomLink: 'https://zoom.us/j/777888999',
        price: 79.99,
        tokensEarned: 75,
        skillsTaught: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
        status: WorkshopStatus.UPCOMING,
        startDate: new Date(Date.now() + 21 * 86400000),
        endDate: new Date(Date.now() + 35 * 86400000),
        totalSeats: 15,
        outcomes: ['Cloud architecture', 'Container orchestration', 'CI/CD pipelines'],
        rules: ['Basic Linux knowledge', 'AWS account required'],
        hostId: techEmployer.id
      }
    })
  ]);

  // Add more diverse jobs
  const additionalJobs = await Promise.all([
    prisma.job.create({
      data: {
        title: 'Machine Learning Engineer',
        subtitle: 'Build and deploy ML models',
        description: 'Looking for an ML engineer to develop and deploy machine learning models...',
        requiredSkills: ['Python', 'Machine Learning', 'TensorFlow', 'AWS'],
        tags: ['ML', 'AI', 'Full-time'],
        type: JobType.FULL_TIME,
        location: 'Remote',
        locationType: 'Remote',
        budget: 'NPR 250,000',
        status: JobStatus.OPEN,
        isVerified: true,
        postedTime: '1 day ago',
        proposals: 3,
        aiMatch: 0.92,
        employerId: techEmployer.id,
        applications: {
          create: {
            studentId: additionalStudents[0].id,
            proposal: 'I have completed ML workshops and built several models...',
            status: 'PENDING'
          }
        }
      }
    }),
    prisma.job.create({
      data: {
        title: 'React Native Developer',
        subtitle: 'Build cross-platform mobile apps',
        description: 'Looking for a React Native developer to build our mobile applications...',
        requiredSkills: ['React Native', 'JavaScript', 'Redux', 'Firebase'],
        tags: ['Mobile', 'React Native', 'Full-time'],
        type: JobType.FULL_TIME,
        location: 'Kathmandu',
        locationType: 'Hybrid',
        budget: 'NPR 180,000',
        status: JobStatus.OPEN,
        isVerified: true,
        postedTime: '3 days ago',
        proposals: 8,
        aiMatch: 0.88,
        employerId: techEmployer.id,
        applications: {
          create: {
            studentId: additionalStudents[1].id,
            proposal: 'I have built multiple React Native apps and published them...',
            status: 'ACCEPTED'
          }
        },
        contracts: {
          create: {
            studentId: additionalStudents[1].id,
            employerId: techEmployer.id,
            agreementHash: 'mobile-contract-hash-789',
            status: 'ACTIVE',
            blockchainHash: 'blockchain-hash-789',
            transactionHash: 'tx-hash-789'
          }
        }
      }
    }),
    prisma.job.create({
      data: {
        title: 'DevOps Engineer',
        subtitle: 'Manage cloud infrastructure',
        description: 'Looking for a DevOps engineer to manage our cloud infrastructure...',
        requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
        tags: ['DevOps', 'Cloud', 'Full-time'],
        type: JobType.FULL_TIME,
        location: 'Remote',
        locationType: 'Remote',
        budget: 'NPR 220,000',
        status: JobStatus.OPEN,
        isVerified: true,
        postedTime: '5 days ago',
        proposals: 6,
        aiMatch: 0.85,
        employerId: techEmployer.id,
        applications: {
          create: {
            studentId: additionalStudents[2].id,
            proposal: 'I have experience with AWS and containerization...',
            status: 'PENDING'
          }
        }
      }
    })
  ]);

  // Add more open source projects
  const additionalProjects = await Promise.all([
    prisma.openSourceProject.create({
      data: {
        title: 'ML Model Training Pipeline',
        description: 'Automated ML model training and deployment pipeline',
        fullDescription: 'End-to-end pipeline for training and deploying ML models...',
        techStack: ['Python', 'TensorFlow', 'AWS', 'Docker'],
        difficulty: 'ADVANCED',
        goals: ['Automate model training', 'Implement MLOps', 'Create documentation'],
        githubUrl: 'https://github.com/example/ml-pipeline',
        hiringLabel: 'help wanted',
        contributionGuidelines: 'Follow ML best practices...',
        goodFirstIssues: ['Add data validation', 'Improve model metrics', 'Add tests'],
        employerId: techEmployer.id,
        status: ProjectStatus.OPEN
      }
    }),
    prisma.openSourceProject.create({
      data: {
        title: 'React Native UI Components',
        description: 'Reusable UI components for React Native',
        fullDescription: 'Collection of customizable UI components for React Native apps...',
        techStack: ['React Native', 'TypeScript', 'Jest', 'Storybook'],
        difficulty: 'INTERMEDIATE',
        goals: ['Create reusable components', 'Add animations', 'Write tests'],
        githubUrl: 'https://github.com/example/rn-components',
        hiringLabel: 'good first issue',
        contributionGuidelines: 'Follow React Native best practices...',
        goodFirstIssues: ['Add new components', 'Improve accessibility', 'Add examples'],
        employerId: techEmployer.id,
        status: ProjectStatus.OPEN
      }
    })
  ]);

  // Add more reviews for workshops
  await prisma.review.createMany({
    data: [
      {
        rating: 5,
        comment: 'Excellent ML workshop! The practical examples were very helpful.',
        reviewerId: additionalStudents[0].id,
        workshopId: additionalWorkshops[0].id
      },
      {
        rating: 4,
        comment: 'Great React Native workshop. Could use more real-world examples.',
        reviewerId: additionalStudents[1].id,
        workshopId: additionalWorkshops[1].id
      }
    ]
  });

  // Add more disputes with different scenarios
  const additionalDisputes = await Promise.all([
    prisma.dispute.create({
      data: {
        reason: 'Project scope not clearly defined',
        evidence: 'Initial requirements document and communication history',
        blockchainHash: 'scope-dispute-hash-333',
        status: DisputeStatus.OPEN,
        raisedById: additionalStudents[1].id,
        contractId: (await prisma.contract.findFirst({ where: { status: 'ACTIVE' } }))?.id || ''
      }
    }),
    prisma.dispute.create({
      data: {
        reason: 'Quality of deliverables not meeting standards',
        evidence: 'Code review and performance test results',
        blockchainHash: 'quality-dispute-hash-444',
        status: DisputeStatus.RESPONDED,
        raisedById: techEmployer.id,
        respondedById: additionalStudents[2].id,
        response: 'I have followed all the requirements and best practices',
        contractId: (await prisma.contract.findFirst({ where: { status: 'ACTIVE' } }))?.id || ''
      }
    })
  ]);

  // Add more votes to disputes
  await prisma.vote.createMany({
    data: [
      {
        disputeId: additionalDisputes[0].id,
        voterId: ramSharma.id,
        votedForId: additionalStudents[1].id
      },
      {
        disputeId: additionalDisputes[0].id,
        voterId: otherStudents[0].id,
        votedForId: techEmployer.id
      },
      {
        disputeId: additionalDisputes[1].id,
        voterId: additionalStudents[0].id,
        votedForId: additionalStudents[2].id
      }
    ]
  });

  // Add more token rewards
  await prisma.tokenReward.createMany({
    data: [
      {
        userId: additionalStudents[0].id,
        amount: 40,
        reason: 'Completed ML workshop with distinction',
        disputeId: null
      },
      {
        userId: additionalStudents[1].id,
        amount: 35,
        reason: 'Active contribution to open source',
        disputeId: null
      },
      {
        userId: additionalStudents[2].id,
        amount: 45,
        reason: 'Won coding challenge',
        disputeId: null
      }
    ]
  });

  // Add more job invites
  await prisma.jobInvite.createMany({
    data: [
      {
        jobId: additionalJobs[0].id,
        studentId: additionalStudents[0].id,
        employerId: techEmployer.id,
        status: 'PENDING'
      },
      {
        jobId: additionalJobs[2].id,
        studentId: additionalStudents[2].id,
        employerId: techEmployer.id,
        status: 'ACCEPTED'
      }
    ]
  });

  // Add more disputes between other employers and students
  const otherDisputes = await Promise.all([
    prisma.dispute.create({
      data: {
        reason: 'Payment delay for completed work',
        evidence: 'Contract agreement and completion proof',
        blockchainHash: 'payment-dispute-hash-555',
        status: DisputeStatus.OPEN,
        raisedById: otherStudents[0].id,
        contractId: (await prisma.contract.findFirst({ where: { status: 'COMPLETED' } }))?.id || ''
      }
    }),
    prisma.dispute.create({
      data: {
        reason: 'Miscommunication on project requirements',
        evidence: 'Email threads and project documentation',
        blockchainHash: 'miscommunication-dispute-hash-666',
        status: DisputeStatus.RESPONDED,
        raisedById: techEmployer.id,
        respondedById: otherStudents[1].id,
        response: 'I have provided all necessary documentation and communication',
        contractId: (await prisma.contract.findFirst({ where: { status: 'ACTIVE' } }))?.id || ''
      }
    })
  ]);

  // Add votes from Ram and other students to these disputes
  await prisma.vote.createMany({
    data: [
      {
        disputeId: otherDisputes[0].id,
        voterId: ramSharma.id,
        votedForId: otherStudents[0].id
      },
      {
        disputeId: otherDisputes[1].id,
        voterId: ramSharma.id,
        votedForId: techEmployer.id
      }
    ]
  });

  // Add dispute resolutions
  await prisma.disputeResolution.createMany({
    data: [
      {
        disputeId: otherDisputes[0].id,
        winnerId: otherStudents[0].id,
        resolverId: admin.id
      },
      {
        disputeId: otherDisputes[1].id,
        winnerId: techEmployer.id,
        resolverId: admin.id
      }
    ]
  });

  // Add token rewards for dispute resolutions
  await prisma.tokenReward.createMany({
    data: [
      {
        userId: otherStudents[0].id,
        amount: 50,
        reason: 'Won dispute resolution',
        disputeId: otherDisputes[0].id
      },
      {
        userId: techEmployer.id,
        amount: 40,
        reason: 'Won dispute resolution',
        disputeId: otherDisputes[1].id
      }
    ]
  });

  console.log('✅ Database seeded successfully!');
  console.log(`
🔐 Login Credentials:
Admin: admin@chalkbox.com / password123
Tech Employer: employer@chalkbox.com / password123
Ram Sharma: ram@chalkbox.com / password123`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });