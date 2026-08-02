# MentorConnect AI — Git & Repository Setup Guide

## Repository Information

- **GitHub Repository**: `https://github.com/rahulshajii/mentorconnect-ai`
- **Default Branch**: `main`

---

## Workflow Standards

1. **Commit History**: Commits represent incremental feature implementations (Sprint 1 scope: RANS1 to RANS5).
2. **Branching Model**:
   - `main`: Production-ready code.
   - `feature/rans1-registration`: Learner registration module.
   - `feature/rans2-mentor-registration`: Mentor registration module.
   - `feature/rans3-auth`: JWT & bcrypt login protection.
   - `feature/rans4-learner-profile`: Learner dashboard & profile.
   - `feature/rans5-mentor-profile`: Mentor dashboard & profile.

---

## Initial Push Commands

```bash
git init
git remote add origin https://github.com/rahulshajii/mentorconnect-ai.git
git add .
git commit -m "feat(core): initialize production architecture for MentorConnect AI (Sprint 1 scope)"
git branch -M main
git push -u origin main
```
