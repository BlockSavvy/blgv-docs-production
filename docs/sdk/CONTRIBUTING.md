# Contributing to BLGV Ecosystem SDK

Thank you for your interest in contributing to the BLGV Ecosystem SDK! 

## 🚀 Quick Start

1. **Fork the repository**
2. **Clone your fork**: `git clone https://github.com/your-username/Unified-Treasury-System.git`
3. **Install dependencies**: `npm install` (TypeScript SDK) or follow platform-specific setup
4. **Make your changes**
5. **Test thoroughly** using our regtest environment
6. **Submit a pull request**

## 📋 Development Guidelines

### Code Standards
- **TypeScript**: Use strict typing for all new code
- **Bitcoin-First**: All features must align with Bitcoin-native principles
- **No Hardcoded Data**: All data must come from appropriate sources (regtest/production)
- **Mobile-First**: Design APIs for mobile consumption first

### Testing Requirements
- Unit tests for all new functions
- Integration tests with regtest environment
- End-to-end testing for user workflows
- Performance benchmarks for critical paths

### Documentation
- JSDoc comments for all public APIs
- README updates for new features
- Example code for complex integrations
- Architecture decision records (ADRs) for significant changes

## 🔧 SDK Structure

```
sdk/
├── typescript/           # Primary SDK (canonical)
├── ios/                 # iOS Native SDK
└── documentation/       # SDK-specific docs
```

## 🐛 Bug Reports

Please include:
- SDK version and platform
- Environment (regtest/production)
- Reproduction steps
- Expected vs actual behavior
- Relevant logs or error messages

## 💡 Feature Requests

Before proposing new features:
- Check existing issues and roadmap
- Consider Bitcoin-native alignment
- Evaluate cross-platform impact
- Discuss with maintainers first

## 📞 Contact

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Security**: See SECURITY.md
- **General**: See main project documentation

---

**Remember**: We're building the future of Bitcoin-native financial infrastructure. Every contribution should advance that mission. 🚀₿ 