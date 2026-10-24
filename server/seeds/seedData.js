const bcrypt = require('bcryptjs');
const User = require('../models/User');
const MentorProfile = require('../models/MentorProfile');
const LearnerProfile = require('../models/LearnerProfile');
const Course = require('../models/Course');

const sampleCourses = [
  {
    title: 'Full-Stack React & Node.js Mastery',
    slug: 'full-stack-react-nodejs-mastery',
    description:
      'Master modern full-stack web application development using React 19, Node.js, Express, MongoDB, and JWT authentication. Build secure, scalable enterprise architectures from scratch.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80',
    category: 'Web Development',
    level: 'Intermediate',
    duration: '8 Hours',
    price: 49,
    currency: 'USD',
    learningObjectives: [
      'Design RESTful microservices with Node.js and Express',
      'Architect modular React 19 frontends with Material UI',
      'Implement robust JWT authentication and role-based access control',
      'Deploy and optimize full-stack applications with MongoDB Atlas',
    ],
    prerequisites: ['Basic JavaScript (ES6+)', 'HTML & CSS fundamentals'],
    instructorName: 'Alex Rivera',
    instructorTitle: 'Principal Full-Stack Architect',
    curriculum: [
      {
        lessonId: 'fs-l1',
        title: 'Modern Full-Stack Architecture Principles',
        description: 'Understand the decoupled client-server model, stateless APIs, and lifecycle flow.',
        duration: '45 mins',
        videoUrl: 'https://www.youtube.com/embed/SqcY0GlETPk',
        order: 1,
        isRequired: true,
      },
      {
        lessonId: 'fs-l2',
        title: 'Building Scalable Express REST APIs',
        description: 'Set up Express routes, controllers, middleware, and centralized error handling.',
        duration: '60 mins',
        videoUrl: 'https://www.youtube.com/embed/7CqJlxBYj-M',
        order: 2,
        isRequired: true,
      },
      {
        lessonId: 'fs-l3',
        title: 'MongoDB Schema Design & Mongoose ODM',
        description: 'Design relational-style schemas in document DBs, indexes, and virtual fields.',
        duration: '50 mins',
        videoUrl: 'https://www.youtube.com/embed/ofme2o29ngU',
        order: 3,
        isRequired: true,
      },
      {
        lessonId: 'fs-l4',
        title: 'Secure JWT Authentication & Password Encryption',
        description: 'Implement bcrypt hashing, bearer token signing, and HTTP authorization headers.',
        duration: '55 mins',
        videoUrl: 'https://www.youtube.com/embed/mbsmsi7l3r4',
        order: 4,
        isRequired: true,
      },
      {
        lessonId: 'fs-l5',
        title: 'State Management & Custom React Hooks',
        description: 'Master React Context, custom API hooks, and optimistic UI updates.',
        duration: '65 mins',
        videoUrl: 'https://www.youtube.com/embed/dpw9EHDh2bM',
        order: 5,
        isRequired: true,
      },
    ],
    published: true,
    completionRequirements: {
      minLessonPercentage: 100,
      requireAssessmentPass: true,
      passingScore: 70,
    },
    assessment: [
      {
        questionId: 'fs_q1',
        question: 'Which HTTP method should be used to make idempotent resource updates?',
        options: ['POST', 'PUT', 'CONNECT', 'TRACE'],
        correctAnswer: 'PUT',
        explanation: 'PUT is defined by RFC 7231 as an idempotent method for replacing the target resource.',
      },
      {
        questionId: 'fs_q2',
        question: 'Where should sensitive JWT secrets be stored in a production Node.js application?',
        options: ['Hardcoded in source control', 'Environment variables (.env)', 'Client local storage', 'URL query parameters'],
        correctAnswer: 'Environment variables (.env)',
        explanation: 'Secrets must be kept in secure server-side environment variables outside version control.',
      },
      {
        questionId: 'fs_q3',
        question: 'What is the primary function of bcrypt salt rounds?',
        options: [
          'To compress the password hash size',
          'To make brute-force and rainbow table attacks exponentially slower',
          'To decrypt the password during login',
          'To encode the password into Base64',
        ],
        correctAnswer: 'To make brute-force and rainbow table attacks exponentially slower',
        explanation: 'Salt rounds determine the computational cost of hashing, resisting brute-force attacks.',
      },
    ],
    rating: 4.9,
  },
  {
    title: 'Distributed System Design & Scalability',
    slug: 'distributed-system-design-scalability',
    description:
      'Learn how high-traffic systems scale to millions of users. Deep dive into caching strategies, message queues, database sharding, CAP theorem, and fault-tolerant architectures.',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    category: 'System Design',
    level: 'Advanced',
    duration: '10 Hours',
    price: 79,
    currency: 'USD',
    learningObjectives: [
      'Master the CAP theorem and trade-offs in distributed systems',
      'Design horizontal load balancing and reverse proxy topologies',
      'Implement multi-tier caching with Redis and CDN edge networks',
      'Understand asynchronous event-driven architectures with Kafka and RabbitMQ',
    ],
    prerequisites: ['Backend development experience', 'Familiarity with databases and networking'],
    instructorName: 'Sarah Jenkins',
    instructorTitle: 'Staff Infrastructure Engineer',
    curriculum: [
      {
        lessonId: 'sd-l1',
        title: 'CAP Theorem & Distributed Consensus',
        description: 'Evaluate Consistency, Availability, and Partition Tolerance in real-world clusters.',
        duration: '50 mins',
        videoUrl: 'https://www.youtube.com/embed/k-Yaq8AHlFA',
        order: 1,
        isRequired: true,
      },
      {
        lessonId: 'sd-l2',
        title: 'High-Throughput Caching Strategies',
        description: 'Cache-aside, write-through, write-behind, and cache stampede mitigations.',
        duration: '60 mins',
        videoUrl: 'https://www.youtube.com/embed/dGAgxozNWFE',
        order: 2,
        isRequired: true,
      },
      {
        lessonId: 'sd-l3',
        title: 'Database Sharding & Replication Topologies',
        description: 'Master primary-replica read scaling, consistent hashing, and horizontal partitioning.',
        duration: '55 mins',
        videoUrl: 'https://www.youtube.com/embed/5faMjKuB9bc',
        order: 3,
        isRequired: true,
      },
      {
        lessonId: 'sd-l4',
        title: 'Message Queues & Asynchronous Decoupling',
        description: 'Pub/sub streaming patterns, backpressure, and at-least-once delivery guarantees.',
        duration: '50 mins',
        videoUrl: 'https://www.youtube.com/embed/oUIDL4SB60g',
        order: 4,
        isRequired: true,
      },
    ],
    published: true,
    completionRequirements: {
      minLessonPercentage: 100,
      requireAssessmentPass: true,
      passingScore: 70,
    },
    assessment: [
      {
        questionId: 'sd_q1',
        question: 'Under network partition in the CAP theorem, what choice must a distributed system make?',
        options: [
          'Choose between Consistency and Availability',
          'Choose between Speed and Memory',
          'Choose between Security and Encryption',
          'No trade-off is required',
        ],
        correctAnswer: 'Choose between Consistency and Availability',
        explanation: 'When partitions occur, systems must either return error (Consistency) or return stale data (Availability).',
      },
      {
        questionId: 'sd_q2',
        question: 'Which caching strategy writes data to cache and database synchronously?',
        options: ['Write-through', 'Write-behind (Write-back)', 'Cache-aside', 'Read-through only'],
        correctAnswer: 'Write-through',
        explanation: 'Write-through ensures strong consistency by writing to the cache and the primary datastore at the same time.',
      },
    ],
    rating: 5.0,
  },
  {
    title: 'Python for AI & Adaptive Inference Systems',
    slug: 'python-ai-adaptive-inference-systems',
    description:
      'Explore AI foundations, rule-based inference engines, feature weighting, and heuristic recommendation algorithms similar to AMIE. Build intelligent systems that adapt to user profiles.',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    category: 'Data & AI',
    level: 'Intermediate',
    duration: '6 Hours',
    price: 0, // FREE COURSE!
    currency: 'USD',
    learningObjectives: [
      'Understand deterministic vs heuristic inference scoring systems',
      'Implement multi-factor weighted matching algorithms in Python',
      'Evaluate skill gap distributions and target readiness metrics',
      'Integrate rule-based recommendation outputs with web dashboards',
    ],
    prerequisites: ['Basic Python programming knowledge'],
    instructorName: 'Dr. Marcus Vance',
    instructorTitle: 'AI Research Scientist & AMIE Lead',
    curriculum: [
      {
        lessonId: 'ai-l1',
        title: 'Introduction to Rule-Based & Heuristic Inference',
        description: 'Understand how expert systems calculate weighted confidence without black-box models.',
        duration: '40 mins',
        videoUrl: 'https://www.youtube.com/embed/aircAruvnKk',
        order: 1,
        isRequired: true,
      },
      {
        lessonId: 'ai-l2',
        title: 'Designing Feature Weight Matrices',
        description: 'Map domain expertise, quiz gaps, and user career goals into numerical vectors.',
        duration: '50 mins',
        videoUrl: 'https://www.youtube.com/embed/kCc8FmEb1nY',
        order: 2,
        isRequired: true,
      },
      {
        lessonId: 'ai-l3',
        title: 'Explainable AI: Generating Transparent Reasoning',
        description: 'Generate human-readable explanations alongside match scores for trust and clarity.',
        duration: '45 mins',
        videoUrl: 'https://www.youtube.com/embed/7eh4d6sabA0',
        order: 3,
        isRequired: true,
      },
    ],
    published: true,
    completionRequirements: {
      minLessonPercentage: 100,
      requireAssessmentPass: true,
      passingScore: 70,
    },
    assessment: [
      {
        questionId: 'ai_q1',
        question: 'What is the primary advantage of an explainable inference engine like AMIE?',
        options: [
          'It provides transparent, inspectable reasons for its recommendations',
          'It requires billions of GPU training parameters',
          'It cannot be tested deterministically',
          'It generates random outputs',
        ],
        correctAnswer: 'It provides transparent, inspectable reasons for its recommendations',
        explanation: 'Explainable inference builds trust by surfacing the exact factors (skills, experience, gap) behind a recommendation.',
      },
      {
        questionId: 'ai_q2',
        question: 'In a weighted matching algorithm, what determines the final score?',
        options: [
          'Linear sum of normalized feature scores multiplied by their weights',
          'Only the last registered skill',
          'Alphabetical order of mentor names',
          'Random sampling',
        ],
        correctAnswer: 'Linear sum of normalized feature scores multiplied by their weights',
        explanation: 'Multi-criteria decision models compute the weighted sum across domain expertise, ratings, and learning gaps.',
      },
    ],
    rating: 4.8,
  },
  {
    title: 'Cloud Architecture with Docker & Kubernetes',
    slug: 'cloud-architecture-docker-kubernetes',
    description:
      'Containerize applications, configure multi-stage Docker builds, orchestrate microservices with Kubernetes, manage Ingress controllers, and configure CI/CD delivery pipelines.',
    thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=1200&q=80',
    category: 'Cloud & DevOps',
    level: 'Advanced',
    duration: '7 Hours',
    price: 59,
    currency: 'USD',
    learningObjectives: [
      'Write optimized, secure multi-stage Dockerfiles',
      'Configure Kubernetes Pods, Deployments, and Services',
      'Manage ConfigMaps, Secrets, and Persistent Volumes',
      'Implement health probes, rolling zero-downtime updates, and auto-scaling',
    ],
    prerequisites: ['Linux command line basics', 'Basic backend server experience'],
    instructorName: 'David Chen',
    instructorTitle: 'DevOps & Cloud Infrastructure Lead',
    curriculum: [
      {
        lessonId: 'devops-l1',
        title: 'Containerization Fundamentals & Dockerfiles',
        description: 'Understand container isolation, layers, and minimal Alpine base images.',
        duration: '45 mins',
        videoUrl: 'https://www.youtube.com/embed/gAkwW2tuIqE',
        order: 1,
        isRequired: true,
      },
      {
        lessonId: 'devops-l2',
        title: 'Kubernetes Architecture & Core Primitives',
        description: 'Explore the control plane, kubelet, pods, replica sets, and deployment manifests.',
        duration: '55 mins',
        videoUrl: 'https://www.youtube.com/embed/X48VuDVv0do',
        order: 2,
        isRequired: true,
      },
      {
        lessonId: 'devops-l3',
        title: 'Networking, Ingress & Service Discovery',
        description: 'ClusterIP, NodePort, LoadBalancer, and routing traffic with Nginx Ingress.',
        duration: '50 mins',
        videoUrl: 'https://www.youtube.com/embed/Vv8aA_5q7qA',
        order: 3,
        isRequired: true,
      },
    ],
    published: true,
    completionRequirements: {
      minLessonPercentage: 100,
      requireAssessmentPass: true,
      passingScore: 70,
    },
    assessment: [
      {
        questionId: 'devops_q1',
        question: 'What is the smallest deployable computing unit in Kubernetes?',
        options: ['Pod', 'Container', 'Cluster', 'Namespace'],
        correctAnswer: 'Pod',
        explanation: 'A Pod represents a single instance of a running process and can contain one or more tightly coupled containers.',
      },
    ],
    rating: 4.9,
  },
  {
    title: 'Modern REST & GraphQL API Engineering',
    slug: 'modern-rest-graphql-api-engineering',
    description:
      'Design clean, developer-friendly APIs. Compare RESTful design patterns with GraphQL queries, mutations, subscriptions, pagination, rate limiting, and automated OpenAPI documentation.',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    category: 'Web Development',
    level: 'Beginner',
    duration: '4 Hours',
    price: 0, // FREE COURSE!
    currency: 'USD',
    learningObjectives: [
      'Structure standard REST endpoints following HTTP status conventions',
      'Implement GraphQL schemas, types, queries, and resolvers',
      'Apply rate limiting, CORS policies, and request payload validation',
      'Auto-generate Swagger / OpenAPI documentation',
    ],
    prerequisites: ['Basic JavaScript'],
    instructorName: 'Elena Rostova',
    instructorTitle: 'Senior API Platform Engineer',
    curriculum: [
      {
        lessonId: 'api-l1',
        title: 'HTTP Semantics & RESTful Best Practices',
        description: 'Resource naming, standard status codes (200, 201, 400, 401, 404, 500), and versioning.',
        duration: '35 mins',
        videoUrl: 'https://www.youtube.com/embed/-MTSQjw5DrM',
        order: 1,
        isRequired: true,
      },
      {
        lessonId: 'api-l2',
        title: 'GraphQL Core: Schemas, Types & Resolvers',
        description: 'Solve over-fetching and under-fetching with declarative queries and field resolvers.',
        duration: '45 mins',
        videoUrl: 'https://www.youtube.com/embed/ed8SzALpx1Q',
        order: 2,
        isRequired: true,
      },
    ],
    published: true,
    completionRequirements: {
      minLessonPercentage: 100,
      requireAssessmentPass: true,
      passingScore: 70,
    },
    assessment: [
      {
        questionId: 'api_q1',
        question: 'Which HTTP status code signifies that a resource was successfully created on the server?',
        options: ['200 OK', '201 Created', '204 No Content', '302 Found'],
        correctAnswer: '201 Created',
        explanation: 'HTTP 201 Created is the standard response confirming that one or more new resources have been created.',
      },
    ],
    rating: 4.7,
  },
];

const seedDatabase = async () => {
  try {
    console.log('--- Checking & Seeding MentorConnect AI Baseline Data ---');

    // 1. Seed Admin User if not existing
    const adminEmail = 'admin@mentorconnect.ai';
    let adminUser = await User.findOne({ email: adminEmail });
    if (!adminUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('adminpassword123', salt);
      adminUser = await User.create({
        name: 'MentorConnect Administrator',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
      });
      console.log(`✅ Seeded Admin User: ${adminEmail} (password: adminpassword123)`);
    }

    // 2. Seed Mentors if not existing
    const mentorData = [
      {
        name: 'Alex Rivera',
        email: 'alex.rivera@mentorconnect.ai',
        experience: 8,
        sessionPrice: 65,
        rating: 4.9,
        bio: 'Principal Software Architect with 8+ years leading distributed systems and MERN stack engineering at scale.',
        expertise: [
          { name: 'React', experience: 7 },
          { name: 'Node.js', experience: 8 },
          { name: 'System Architecture', experience: 6 },
          { name: 'MongoDB', experience: 6 },
        ],
        availability: ['Monday 10:00 AM - 12:00 PM', 'Thursday 2:00 PM - 5:00 PM'],
        coverPicture: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Dr. Marcus Vance',
        email: 'marcus.vance@mentorconnect.ai',
        experience: 10,
        sessionPrice: 85,
        rating: 5.0,
        bio: 'AI Research Director and developer of the Adaptive Mentoring Inference Engine (AMIE). Specializes in machine learning and scalable Python backends.',
        expertise: [
          { name: 'Python', experience: 10 },
          { name: 'Machine Learning', experience: 8 },
          { name: 'System Architecture', experience: 7 },
          { name: 'Node.js', experience: 5 },
        ],
        availability: ['Tuesday 11:00 AM - 01:00 PM', 'Friday 03:00 PM - 06:00 PM'],
        coverPicture: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Sarah Jenkins',
        email: 'sarah.jenkins@mentorconnect.ai',
        experience: 8,
        sessionPrice: 75,
        rating: 4.9,
        bio: 'Staff Infrastructure Engineer & Senior Tech Lead with 8+ years architecting high-throughput distributed systems, event streams, and cloud microservices.',
        expertise: [
          { name: 'System Architecture', experience: 8 },
          { name: 'Distributed Systems', experience: 7 },
          { name: 'Docker & Kubernetes', experience: 6 },
          { name: 'Node.js', experience: 6 },
        ],
        availability: ['Monday 02:00 PM - 05:00 PM', 'Thursday 10:00 AM - 01:00 PM'],
        coverPicture: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      },
    ];

    for (const m of mentorData) {
      let user = await User.findOne({ email: m.email });
      if (!user) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('mentorpassword123', salt);
        user = await User.create({
          name: m.name,
          email: m.email,
          password: hashedPassword,
          role: 'mentor',
        });

        await MentorProfile.create({
          userId: user._id,
          experience: m.experience,
          sessionPrice: m.sessionPrice,
          rating: m.rating,
          bio: m.bio,
          expertise: m.expertise,
          availability: m.availability,
          coverPicture: m.coverPicture,
          profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(m.name)}`,
        });
        console.log(`✅ Seeded Mentor: ${m.name} (${m.email})`);
      }
    }

    // 3. Seed Default Learners with Rich Profiles
    const learnerData = [
      {
        name: 'Rahul Shaji',
        email: 'learner@example.com',
        education: 'Master of Computer Applications (MCA)',
        careerGoal: 'Cloud & AI DevOps Architect',
        bio: 'Passionate developer building resilient distributed systems and learning full-stack engineering with MentorConnect AI.',
        skills: [
          { name: 'JavaScript', level: 'Expert' },
          { name: 'React', level: 'Advanced' },
          { name: 'Node.js', level: 'Advanced' },
          { name: 'Docker', level: 'Intermediate' },
          { name: 'System Architecture', level: 'Intermediate' },
        ],
        socialLinks: {
          github: 'https://github.com/rahulshajii',
          linkedin: 'https://linkedin.com/in/rahulshaji',
          portfolio: 'https://rahulshaji.dev',
        },
      },
    ];

    for (const l of learnerData) {
      let user = await User.findOne({ email: l.email });
      if (!user) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        user = await User.create({
          name: l.name,
          email: l.email,
          password: hashedPassword,
          role: 'learner',
        });
        console.log(`✅ Seeded Learner User: ${l.email} (password: password123)`);
      }

      let profile = await LearnerProfile.findOne({ userId: user._id });
      if (!profile) {
        profile = await LearnerProfile.create({
          userId: user._id,
          education: l.education,
          careerGoal: l.careerGoal,
          bio: l.bio,
          skills: l.skills,
          profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(l.name)}`,
          coverPicture: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
          socialLinks: l.socialLinks,
        });
        console.log(`✅ Seeded Learner Profile for: ${l.email}`);
      } else if (!profile.skills || profile.skills.length === 0) {
        profile.skills = l.skills;
        if (!profile.education) profile.education = l.education;
        if (!profile.careerGoal) profile.careerGoal = l.careerGoal;
        if (!profile.bio) profile.bio = l.bio;
        await profile.save();
        console.log(`✅ Enriched Learner Profile with skills for: ${l.email}`);
      }
    }

    // 4. Seed Courses if collection is empty
    const courseCount = await Course.countDocuments();
    if (courseCount === 0) {
      console.log('Seeding official sample course catalog...');
      for (const c of sampleCourses) {
        await Course.create(c);
      }
      console.log(`✅ Successfully seeded ${sampleCourses.length} technical courses.`);
    } else {
      console.log(`ℹ️ Course catalog already populated (${courseCount} courses found).`);
    }

    console.log('--- Database Baseline Verification Complete ---');
  } catch (err) {
    console.error('Error during database seeding:', err.message);
  }
};

module.exports = { seedDatabase, sampleCourses };
