# BuyaReco - Detailed Infrastructure & Cost Breakdown (INR)

**Currency:** Indian Rupees (₹)
**Exchange Rate:** 1 USD = ₹83 (as of Nov 2025)
**Target Scale:** 100,000 Monthly Active Users (MAU)
**Platform:** Web + iOS + Android

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Infrastructure Requirements Calculation](#infrastructure-requirements-calculation)
3. [Detailed Cost Breakdown by Service](#detailed-cost-breakdown-by-service)
4. [Cost Comparison by Cloud Provider](#cost-comparison-by-cloud-provider)
5. [Scaling Costs by User Count](#scaling-costs-by-user-count)
6. [Complete Monthly Budget](#complete-monthly-budget)
7. [One-Time Setup Costs](#one-time-setup-costs)
8. [Annual Cost Projection](#annual-cost-projection)

---

## Executive Summary

### Infrastructure Costs for 100,000 Users

| Category | Monthly Cost (INR) | Annual Cost (INR) |
|----------|-------------------|-------------------|
| **Hosting & Compute** | ₹61,586 | ₹7,39,032 |
| **Database & Storage** | ₹1,65,917 | ₹19,91,004 |
| **CDN & Bandwidth** | ₹16,600 | ₹1,99,200 |
| **Email & Notifications** | ₹7,466 | ₹89,592 |
| **Monitoring & Analytics** | ₹12,450 | ₹1,49,400 |
| **Backup & Security** | ₹6,225 | ₹74,700 |
| **Payment Processing** | ₹18,260 | ₹2,19,120 |
| **Domain & SSL** | ₹83 | ₹996 |
| **Miscellaneous** | ₹4,150 | ₹49,800 |
| **TOTAL** | **₹2,92,737** | **₹35,12,844** |

**Per User Cost:** ₹2.93/month
**Daily Cost:** ₹9,758

---

## Infrastructure Requirements Calculation

### Step 1: User Activity Analysis

**Assumptions for 100,000 MAU:**
```
Total Users: 100,000
Daily Active Users (30% of MAU): 30,000
Peak Concurrent Users (10% of DAU): 3,000
Average Session Duration: 8 minutes
Sessions per User per Day: 3

Daily Calculations:
├── Total Daily Sessions: 30,000 users × 3 sessions = 90,000 sessions
├── Total Session Minutes: 90,000 × 8 minutes = 7,20,000 minutes
└── Peak Hour Sessions (15% of daily): 13,500 sessions

Request Calculations:
├── API Requests per Session: ~50 requests
├── Daily API Requests: 90,000 × 50 = 45,00,000 requests
├── Monthly API Requests: 45,00,000 × 30 = 13,50,00,000 (135 million)
└── Requests per Second (peak): ~180 RPS
```

### Step 2: Data Storage Requirements

**Database Storage:**
```
User Table:
├── Each User Record: ~2 KB
├── 100,000 users × 2 KB = 200 MB
└── With indexes (2x): 400 MB

Recommendations Table:
├── Avg Recommendations per User: 15
├── Total Recommendations: 100,000 × 15 = 15,00,000
├── Each Record: ~5 KB (text, metadata)
├── Total Size: 15,00,000 × 5 KB = 7.5 GB
└── With indexes (1.5x): 11.25 GB

Messages Table:
├── Messages per User per Month: 50
├── Total Monthly Messages: 100,000 × 50 = 50,00,000
├── Each Message: ~1 KB
├── Monthly Growth: 5 GB
└── 6 Months Retention: 30 GB

Photos/Media (User Avatars):
├── Users with Photos: 60,000 (60%)
├── Avg Photo Size: 500 KB
├── Total: 60,000 × 500 KB = 30 GB
└── Compressed & Optimized: 20 GB

Instagram Photos Cache:
├── Users with Instagram: 20,000 (20%)
├── 6 Photos per User: 20,000 × 6 = 1,20,000 photos
├── Avg Photo Size: 300 KB (cached, compressed)
├── Total: 1,20,000 × 300 KB = 36 GB
└── Stored as URLs mostly, actual: 5 GB

Total Database Storage Required:
├── User Data: 0.4 GB
├── Recommendations: 11.25 GB
├── Messages: 30 GB
├── Total: 41.65 GB
└── With 40% buffer: ~60 GB

Total File Storage (S3/R2):
├── User Avatars: 20 GB
├── Recommendation Photos: 100 GB
├── Instagram Cache: 5 GB
├── Misc Files: 25 GB
├── Total: 150 GB
└── With backups (2x): 300 GB
```

### Step 3: Bandwidth Requirements

**Monthly Bandwidth:**
```
API Responses:
├── 135 million requests/month
├── Avg Response Size: 10 KB
├── Total: 135M × 10 KB = 1,350 GB
└── = 1.35 TB

Static Assets (CSS, JS):
├── Sessions: 90,000 × 30 days = 27,00,000
├── Assets per Session: 2 MB (cached after first load)
├── Cache Hit Rate: 80%
├── Actual Downloads: 27,00,000 × 20% × 2 MB = 1,080 GB
└── = 1.08 TB

Images/Media:
├── Image Views: 50 per user per month
├── Total Views: 100,000 × 50 = 50,00,000
├── Avg Image Size: 200 KB
├── CDN Cache Hit: 70%
├── Origin Requests: 50,00,000 × 30% × 200 KB = 300 GB
└── CDN Delivery: 50,00,000 × 200 KB = 1,000 GB

Total Bandwidth:
├── API: 1.35 TB
├── Static: 1.08 TB
├── Images: 1.00 TB
├── Total: 3.43 TB/month
└── With 20% buffer: 4.1 TB/month
```

### Step 4: Compute Requirements

**CPU & Memory Calculation:**

**Web Servers (Frontend):**
```
Concurrent Users: 3,000
Processing Time per Request: 50ms
CPU Cores Needed: (3,000 × 0.05) / 1 = 150 core-seconds

Actual Servers:
├── Server Type: 2 vCPU, 8GB RAM (handles ~1,000 concurrent)
├── Servers Needed: 3,000 / 1,000 = 3 servers
└── With HA (High Availability): 3 servers

Total: 3 × t3.large instances
```

**API Servers (Backend):**
```
Requests per Second (peak): 180 RPS
Processing Time per Request: 100ms (includes DB queries)
CPU Cores Needed: (180 × 0.1) / 1 = 18 core-seconds

Database Query Overhead: 2x CPU
Total CPU Needed: 18 × 2 = 36 core-seconds

Actual Servers:
├── Server Type: 4 vCPU, 16GB RAM (handles ~60 RPS)
├── Servers Needed: 180 / 60 = 3 servers
└── With Load Balancing: 3 servers

Total: 3 × t3.xlarge instances
```

**WebSocket Servers (Real-time):**
```
Concurrent Connections: 3,000 users
Connections per Server: 2,000 (with proper tuning)
Servers Needed: 3,000 / 2,000 = 2 servers

Total: 2 × t3.medium instances
```

**Background Workers:**
```
Jobs per Day:
├── Email Sending: 50,000 emails
├── Notification Processing: 1,00,000 notifications
├── Image Processing: 5,000 images
└── Data Aggregation: Hourly jobs

Processing Capacity:
├── 1 Worker: ~10,000 jobs/day
├── Workers Needed: 15,000 / 10,000 = 2 workers
└── Total: 2 × t3.medium instances
```

### Step 5: Database Specifications

**PostgreSQL Requirements:**
```
Database Size: 60 GB
Active Connections: 300 (100 per API server)
Queries per Second: 500 QPS (peak)

Required Specs:
├── CPU: 4 vCPUs (for query processing)
├── RAM: 32 GB (8 GB for OS, 24 GB for cache)
│   └── Calculation: Working Set (20 GB) + Buffer (4 GB)
├── Storage: 100 GB SSD (60 GB data + 40 GB growth)
└── IOPS: 3,000 IOPS minimum

Recommended Instance:
└── db.r6g.xlarge (4 vCPU, 32GB RAM)

Read Replicas:
├── Read:Write Ratio: 80:20
├── Read QPS: 400
├── Replicas Needed: 2 (200 QPS each)
└── Total Instances: 1 Primary + 2 Replicas = 3
```

### Step 6: Cache (Redis) Requirements

**Redis Specifications:**
```
Cache Size Calculation:
├── User Sessions: 3,000 concurrent × 10 KB = 30 MB
├── API Response Cache: 500 MB
│   └── Top 1000 requests × 500 KB avg
├── Rate Limiting Data: 50 MB
├── Real-time Data: 100 MB
├── Total: 680 MB
└── With 50% buffer: 1 GB

Recommended:
├── Memory: 5 GB (for headroom)
├── CPU: 2 vCPUs
└── Instance: cache.r6g.large or Redis Cloud 5GB
```

---

## Detailed Cost Breakdown by Service

### 1. Hosting & Compute (Monthly: ₹61,586)

#### Web Servers
```
Instance Type: AWS EC2 t3.large
Specifications:
├── vCPU: 2
├── Memory: 8 GB RAM
├── Network: Up to 5 Gbps
└── Storage: 50 GB EBS SSD

Quantity: 3 instances
Reason: Handle 3,000 concurrent users (1,000 per server)

Cost Calculation:
├── Price per Instance: $67/month (₹5,561)
├── Total: 3 × ₹5,561 = ₹16,683
└── Data Transfer (included): 0

Monthly: ₹16,683
```

#### API Servers
```
Instance Type: AWS EC2 t3.xlarge
Specifications:
├── vCPU: 4
├── Memory: 16 GB RAM
├── Network: Up to 5 Gbps
└── Storage: 100 GB EBS SSD

Quantity: 3 instances
Reason: Handle 180 RPS peak (60 RPS per server)

Cost Calculation:
├── Price per Instance: $135/month (₹11,205)
├── Total: 3 × ₹11,205 = ₹33,615
└── Additional EBS (50 GB extra × 3): ₹1,245

Monthly: ₹34,860
```

#### WebSocket Servers
```
Instance Type: AWS EC2 t3.medium
Specifications:
├── vCPU: 2
├── Memory: 4 GB RAM
├── Network: Up to 5 Gbps
└── Storage: 30 GB EBS SSD

Quantity: 2 instances
Reason: Real-time connections (2,000 connections per server)

Cost Calculation:
├── Price per Instance: $34/month (₹2,822)
└── Total: 2 × ₹2,822 = ₹5,644

Monthly: ₹5,644
```

#### Background Workers
```
Instance Type: AWS EC2 t3.medium
Specifications:
├── vCPU: 2
├── Memory: 4 GB RAM
└── Storage: 30 GB EBS SSD

Quantity: 2 instances
Reason: Process background jobs (emails, notifications, image processing)

Cost Calculation:
├── Price per Instance: $34/month (₹2,822)
└── Total: 2 × ₹2,822 = ₹5,644

Monthly: ₹5,644
```

**Total Compute: ₹61,586**

---

### 2. Database (Monthly: ₹1,65,917)

#### Option A: Supabase Enterprise (Recommended)
```
Plan: Supabase Enterprise
Included Services:
├── PostgreSQL Database (Dedicated)
├── Authentication (GoTrue)
├── Storage (50 GB included)
├── Realtime (WebSocket)
├── Edge Functions
└── Auto-scaling

Specifications:
├── Database: Dedicated instance
├── CPU: 8 vCPUs
├── RAM: 32 GB
├── Storage: 100 GB (expandable)
├── Backups: Daily automated
├── Read Replicas: 2 included
└── Connection Pooling: Included

Cost Calculation:
└── Base Price: $1,999/month (₹1,65,917)

Why Supabase?
├── All-in-one solution (saves integration time)
├── Managed service (no DevOps needed)
├── Auto-scaling built-in
├── Real-time features included
├── Row Level Security (RLS) built-in
└── Cheaper than self-managing all services

Monthly: ₹1,65,917
```

#### Option B: Self-Managed AWS RDS (Alternative)
```
Instance Type: db.r6g.xlarge (Graviton2)
Specifications:
├── vCPU: 4
├── RAM: 32 GB
├── Storage: 100 GB SSD (gp3)
└── Multi-AZ: Yes (High Availability)

Configuration:
├── Primary Instance: 1
├── Read Replicas: 2
└── Automated Backups: 7 days retention

Cost Breakdown:
├── Primary (Multi-AZ): $520/month (₹43,160)
├── Replica 1: $260/month (₹21,580)
├── Replica 2: $260/month (₹21,580)
├── Storage (100 GB × 3): $30/month (₹2,490)
├── Backup Storage (50 GB): $5/month (₹415)
├── Data Transfer: $20/month (₹1,660)
└── Total: $1,095/month (₹90,885)

Additional Required Services:
├── Auth Service (Auth0): $240/month (₹19,920)
├── File Storage (S3): $30/month (₹2,490)
├── Realtime (Socket.io server): $67/month (₹5,561)
└── Total Additional: ₹27,971

Grand Total (Self-Managed): ₹1,18,856

Why Not Self-Managed?
├── More complex to maintain
├── Requires DevOps expertise
├── More services to integrate
└── Higher maintenance overhead

Recommendation: Use Supabase Enterprise
Monthly: ₹1,65,917
```

#### Redis Cache
```
Service: AWS ElastiCache for Redis
Instance Type: cache.r6g.large
Specifications:
├── vCPU: 2
├── Memory: 13.07 GB
├── Network: Up to 10 Gbps
└── Multi-AZ: Yes

Configuration:
├── Primary Node: 1
└── Replica Node: 1 (for failover)

Cost Calculation:
├── Primary: $88/month (₹7,304)
├── Replica: $88/month (₹7,304)
└── Total: $176/month (₹14,608)

Why Redis?
├── Caches API responses (reduces DB load by 60%)
├── Session storage (fast user sessions)
├── Rate limiting (prevent abuse)
├── Real-time data (live updates)
└── 10x faster than database queries

Monthly: ₹14,608
```

**Total Database & Cache: ₹1,80,525**

---

### 3. File Storage (Monthly: ₹623)

#### Cloudflare R2 (Recommended)
```
Storage: 300 GB
Why R2?
├── Zero egress fees (FREE bandwidth)
├── S3-compatible API
├── Global CDN built-in
└── Much cheaper than S3

Cost Breakdown:
├── Storage: 300 GB × $0.015/GB = $4.50 (₹373)
├── Class A Operations (Upload): 50,000 × $4.50/million = $0.23 (₹19)
├── Class B Operations (Download): 1M × $0.36/million = $0.36 (₹30)
├── Data Transfer (Egress): FREE (saves ~$360/month vs S3)
└── Total: $5.09/month (₹422)

Monthly: ₹422
```

#### Alternative: AWS S3 (More Expensive)
```
Storage: 300 GB
Data Transfer: 4 TB/month

Cost Breakdown:
├── Storage: 300 GB × $0.023/GB = $6.90 (₹573)
├── PUT/POST Requests: 50,000 × $0.005/1000 = $0.25 (₹21)
├── GET Requests: 1M × $0.0004/1000 = $0.40 (₹33)
├── Data Transfer: 4,000 GB × $0.09/GB = $360 (₹29,880)
└── Total: $367.55/month (₹30,507)

Why NOT S3 for images?
└── 72x more expensive due to egress fees

Monthly (if using S3): ₹30,507
```

**Recommendation: Cloudflare R2**
**Monthly: ₹422**

---

### 4. CDN & Bandwidth (Monthly: ₹16,600)

#### Cloudflare Business Plan
```
Plan: Cloudflare Business
Bandwidth: Unlimited (no overage charges)

Included Features:
├── Global CDN (200+ data centers)
├── DDoS Protection (unlimited)
├── Web Application Firewall (WAF)
├── SSL/TLS Certificates (free)
├── Image Optimization (Polish)
├── Cache Everything
├── Mobile Optimization
├── Analytics & Logs
└── 24/7 Support

Cost Calculation:
└── Flat Fee: $200/month (₹16,600)

Why Cloudflare Business?
├── Unlimited bandwidth (4+ TB/month included)
├── AWS CloudFront would cost: ~$340/month (₹28,220)
├── Saves: ₹11,620/month
├── Better DDoS protection
└── Simpler pricing (no surprises)

Bandwidth Saved by CDN:
├── Cache Hit Ratio: 85%
├── Origin Requests Reduced: 3.5 TB → 0.5 TB
└── Saved Bandwidth Cost: ~$300/month (₹24,900)

Monthly: ₹16,600
```

#### Alternative: Cloudflare Pro (Budget Option)
```
Plan: Cloudflare Pro
Bandwidth: Unlimited

Features:
├── Basic CDN
├── Basic DDoS Protection
├── SSL/TLS
├── Limited WAF
└── 24/7 Support

Cost: $20/month (₹1,660)

Limitations:
├── No Image Optimization
├── Basic caching rules
└── Limited custom page rules

Monthly: ₹1,660
```

**Recommendation: Cloudflare Business for 100K users**
**Monthly: ₹16,600**

---

### 5. Email Service (Monthly: ₹7,466)

#### SendGrid Pro Plan
```
Plan: SendGrid Pro
Email Volume: 100,000 emails/month

Breakdown:
├── Transactional Emails: 60,000/month
│   ├── Welcome Emails: 3,000
│   ├── Password Resets: 2,000
│   ├── Email Verifications: 3,000
│   ├── Notifications: 45,000
│   └── Receipts: 7,000
│
└── Marketing Emails: 40,000/month
    ├── Weekly Digests: 30,000
    ├── Announcements: 5,000
    └── Re-engagement: 5,000

Features Included:
├── 100,000 emails/month
├── Dedicated IP Address (better deliverability)
├── Email Validation API
├── Advanced Analytics
├── Subuser Management
├── Custom Bounce/Spam Management
└── 24/7 Support

Cost Calculation:
└── Base Price: $89.95/month (₹7,466)

Why SendGrid Pro?
├── Dedicated IP (99% deliverability)
├── No per-email cost fluctuation
├── Better than transactional-only services
└── Scales easily (can add more emails)

Alternative: AWS SES (Cheaper but more work)
├── Cost: $0.10 per 1,000 emails
├── 100,000 emails = $10/month (₹830)
├── BUT: Need to manage bounce/complaints manually
├── Need warm-up dedicated IP yourself
└── More DevOps work

Monthly: ₹7,466
```

---

### 6. Push Notifications (Monthly: FREE initially)

#### Firebase Cloud Messaging (FCM)
```
Service: Firebase Cloud Messaging
Platform: Android

Cost: FREE (unlimited notifications)

Features:
├── Unlimited push notifications
├── Topic-based messaging
├── Device group messaging
├── Analytics included
└── A/B testing

Monthly: ₹0
```

#### Apple Push Notification Service (APNs)
```
Service: Apple Push Notification Service
Platform: iOS

Cost: FREE (unlimited notifications)

Features:
├── Unlimited push notifications
├── Silent notifications
├── Rich notifications (images, actions)
└── Integrated with iOS

Monthly: ₹0
```

#### OneSignal Professional (Optional - Better Analytics)
```
Plan: OneSignal Professional
Why upgrade later?
├── Better analytics dashboard
├── A/B testing
├── Automated messages
├── Journey builder
└── Advanced segmentation

Cost: $99/month (₹8,217) - only if needed later

Monthly (initial): ₹0
```

**Total Push Notifications: ₹0 (initially)**

---

### 7. Search Service (Monthly: ₹4,150)

#### Algolia Standard Plan
```
Plan: Algolia Standard
Search Volume:
├── Search Requests: 500,000/month
├── Records (Indexed Items): 50,000
└── Storage: 5 GB

Why Need Search?
├── Fast autocomplete (< 50ms)
├── Typo tolerance
├── Faceted search (filters)
├── Geo-search (location-based)
└── Better than PostgreSQL full-text search

Cost Breakdown:
├── Base (10,000 searches): $1/month (₹83)
├── Additional 490,000 searches: $49/month (₹4,067)
└── Total: $50/month (₹4,150)

Alternative: Elasticsearch (Self-Hosted)
├── Instance: t3.medium.search × 2
├── Cost: $128/month (₹10,624)
├── BUT: Need to manage, tune, and scale
└── More complex

Recommendation: Algolia (simpler, faster)
Monthly: ₹4,150
```

---

### 8. Monitoring & Analytics (Monthly: ₹12,450)

#### Error Tracking - Sentry Team
```
Plan: Sentry Team
Events: 100,000 errors/month

Features:
├── Error tracking & grouping
├── Performance monitoring
├── Release tracking
├── Source maps support
└── Slack/Email alerts

Cost: $26/month (₹2,158)

Why Sentry?
├── Catch errors before users report
├── Stack traces with source code
├── Performance bottleneck detection
└── Essential for production

Monthly: ₹2,158
```

#### Application Monitoring - Self-Hosted PostHog
```
Service: PostHog (Self-Hosted)
Instance: EC2 t3.large

Specifications:
├── vCPU: 2
├── RAM: 8 GB
├── Storage: 100 GB
└── PostHog + ClickHouse + Redis

Features:
├── Product analytics
├── Session recordings
├── Feature flags
├── A/B testing
└── Unlimited events

Cost Breakdown:
├── EC2 Instance: $67/month (₹5,561)
├── Storage (100 GB EBS): $10/month (₹830)
└── Total: $77/month (₹6,391)

Alternative: Mixpanel Growth (Cloud)
├── Cost: $899/month (₹74,617)
├── 100K users, unlimited events
└── 11x more expensive

Monthly: ₹6,391
```

#### Infrastructure Monitoring - Basic
```
Service: Self-hosted Prometheus + Grafana
OR: DataDog Free Tier

Cost: FREE (initially)

What it monitors:
├── Server CPU, RAM, Disk
├── Database connections
├── Cache hit rates
└── API response times

Upgrade Later: DataDog Pro ($15/host) = ₹12,450/month
For now: ₹0

Monthly: ₹0
```

**Total Monitoring: ₹8,549**

---

### 9. Backup & Security (Monthly: ₹6,225)

#### Automated Backups
```
Database Backups (Supabase):
└── Included in Supabase Enterprise plan
└── Cost: ₹0 (already paid)

File Storage Backups (R2):
├── Duplicate storage for backups: 300 GB
├── Cost: 300 GB × $0.015 = $4.50/month (₹373)
└── Versioning enabled

Application Backups (Code):
└── Git (GitHub): FREE
└── Cost: ₹0

Cost: ₹373
```

#### SSL Certificates
```
Service: Cloudflare SSL (included in Business plan)

Features:
├── Universal SSL
├── Custom SSL
├── Client Certificates
└── Auto-renewal

Cost: ₹0 (included)
```

#### DDoS Protection
```
Service: Cloudflare DDoS Protection

Included in Business Plan:
├── Layer 3/4 Protection (Network)
├── Layer 7 Protection (Application)
├── Rate Limiting
└── Unlimited mitigation

Cost: ₹0 (included)
```

#### Web Application Firewall (WAF)
```
Service: Cloudflare WAF

Rules:
├── OWASP Top 10 Protection
├── SQL Injection Prevention
├── XSS Prevention
├── Custom Rules
└── Managed Rulesets

Cost: ₹0 (included in Business plan)
```

#### Security Audits (Optional - Annual)
```
Third-Party Security Audit: ₹50,000/year
Penetration Testing: ₹75,000/year
Total Annual: ₹1,25,000
Monthly Equivalent: ₹10,417

For 100K Users: Recommended
Monthly: ₹10,417
```

**Total Security & Backup: ₹10,790**

---

### 10. Payment Processing (Monthly: ₹18,260)

#### Stripe Standard
```
Transaction Volume (Estimated):
├── Monthly Payments Processed: 10,000 transactions
├── Average Transaction: ₹500
└── Total Volume: ₹50,00,000/month

Stripe Fees:
├── International Cards: 2.9% + ₹25 per transaction
├── Domestic Cards (India): 2.0% + ₹3 per transaction
└── UPI/Net Banking: 2.0% (no fixed fee)

Assuming Mix:
├── 60% Domestic (6,000 txns): ₹500 avg
│   └── Fee: ₹500 × 2% + ₹3 = ₹13/txn
│   └── Total: 6,000 × ₹13 = ₹78,000
│
└── 40% International (4,000 txns): ₹500 avg
    └── Fee: ₹500 × 2.9% + ₹25 = ₹39.50/txn
    └── Total: 4,000 × ₹39.50 = ₹1,58,000

Total Stripe Fees: ₹2,36,000/month
As % of Revenue: 4.72%

Fixed Costs:
└── Stripe Account: FREE

Note: This is revenue-based, scales with transactions
For cost estimation (assuming revenue):
Monthly: ₹18,260 (if processing ₹5L/month)
```

#### Payment Gateway Alternatives (India-Specific)
```
Razorpay:
├── Domestic: 2% (no setup fee)
├── International: 3%
└── Slightly cheaper for India

Paytm:
├── Domestic: 2%
├── UPI: 0.5%
└── Good for UPI volume

Recommendation: Start with Stripe (easier integration)
```

**Total Payment Processing: ₹18,260**
*(Variable cost - scales with transaction volume)*

---

### 11. Load Balancer (Monthly: ₹2,075)

#### AWS Application Load Balancer (ALB)
```
Service: AWS Application Load Balancer

Configuration:
├── Active Load Balancers: 1
├── Load Balancer Capacity Units (LCU): ~5 LCUs
└── Region: ap-south-1 (Mumbai)

LCU Calculation:
├── New Connections: 180/sec → 2 LCUs
├── Active Connections: 3,000 → 1 LCU
├── Processed Bytes: 500 MB/hr → 1 LCU
├── Rule Evaluations: 500/sec → 1 LCU
└── Total: 5 LCUs (use highest)

Cost Breakdown:
├── ALB Hour: $0.0225/hour × 730 hours = $16.43 (₹1,364)
├── LCU Hours: $0.008/LCU × 5 × 730 = $29.20 (₹2,422)
└── Total: $45.63/month (₹3,787)

Why Need Load Balancer?
├── Distributes traffic across 3 servers
├── Health checks (auto-remove failed servers)
├── SSL termination
└── Zero downtime deployments

Monthly: ₹2,075
```

---

### 12. Domain & SSL (Monthly: ₹83)

#### Domain Registration
```
Domain: buyareco.com
Registrar: Namecheap/GoDaddy

Cost:
├── .com Domain: $12/year (₹996)
└── Monthly: ₹83

Included:
├── WHOIS Privacy
├── DNS Management
└── Email Forwarding
```

#### SSL Certificate
```
SSL: FREE (Cloudflare SSL)

Included in Cloudflare:
├── Universal SSL
├── Auto-renewal
├── Wildcard SSL (*.buyareco.com)
└── Origin SSL

Monthly: ₹0
```

**Total Domain: ₹83**

---

### 13. Development Tools (Monthly: ₹2,075)

#### GitHub
```
Plan: GitHub Team
Seats: 5 developers

Cost: $4/user/month × 5 = $20/month (₹1,660)

Features:
├── Unlimited private repositories
├── GitHub Actions (3,000 minutes)
├── GitHub Packages storage
├── Protected branches
└── Code review tools

Monthly: ₹1,660
```

#### Postman (API Testing)
```
Plan: Postman Professional
Seats: 3 users

Cost: $12/user/month × 3 = $36/month (₹2,988)

Features:
├── API documentation
├── Mock servers
├── Monitoring
└── Team collaboration

Alternative: FREE tier (sufficient initially)
Monthly: ₹0 (use free tier)
```

**Total Dev Tools: ₹1,660**

---

## Cost Comparison by Cloud Provider

### AWS (Most Mature - Recommended for Scale)

| Service | Monthly Cost (₹) | Annual Cost (₹) |
|---------|------------------|-----------------|
| **Compute** | | |
| EC2 Instances (3 web, 3 API, 2 WS, 2 workers) | ₹61,586 | ₹7,39,032 |
| Application Load Balancer | ₹2,075 | ₹24,900 |
| **Database & Cache** | | |
| RDS PostgreSQL (primary + 2 replicas) | ₹86,815 | ₹10,41,780 |
| ElastiCache Redis | ₹14,608 | ₹1,75,296 |
| **Storage & CDN** | | |
| S3 Storage | ₹3,735 | ₹44,820 |
| CloudFront CDN | ₹28,220 | ₹3,38,640 |
| **Services** | | |
| SES Email | ₹830 | ₹9,960 |
| SNS (Notifications) | ₹415 | ₹4,980 |
| **Monitoring** | | |
| CloudWatch | ₹2,490 | ₹29,880 |
| **TOTAL AWS** | **₹2,00,774** | **₹24,09,288** |

**Pros:**
- Most mature and reliable
- Best global infrastructure
- Excellent documentation
- Industry standard

**Cons:**
- More expensive
- Complex pricing
- Steeper learning curve

---

### Supabase + Vercel (Current - Best for MVP to 10K)

| Service | Monthly Cost (₹) | Annual Cost (₹) |
|---------|------------------|-----------------|
| Vercel Pro | ₹1,660 | ₹19,920 |
| Supabase Pro | ₹2,075 | ₹24,900 |
| Cloudflare Pro | ₹1,660 | ₹19,920 |
| SendGrid Essentials | ₹6,640 | ₹79,680 |
| **TOTAL** | **₹12,035** | **₹1,44,420** |

**Pros:**
- Easiest to set up
- Great developer experience
- Fast deployment
- All-in-one

**Cons:**
- Expensive at scale (100K users)
- Less control
- Limited customization

**Good for:** 0-10,000 users

---

### Hybrid Approach (Recommended for 100K Users)

| Service | Provider | Monthly (₹) | Annual (₹) |
|---------|----------|-------------|-----------|
| **Frontend Hosting** | Vercel Pro | ₹1,660 | ₹19,920 |
| **Database & Auth** | Supabase Enterprise | ₹1,65,917 | ₹19,91,004 |
| **Compute (API)** | AWS EC2 | ₹40,425 | ₹4,85,100 |
| **Cache** | Redis Cloud | ₹12,367 | ₹1,48,404 |
| **CDN** | Cloudflare Business | ₹16,600 | ₹1,99,200 |
| **Storage** | Cloudflare R2 | ₹422 | ₹5,064 |
| **Email** | SendGrid Pro | ₹7,466 | ₹89,592 |
| **Search** | Algolia | ₹4,150 | ₹49,800 |
| **Monitoring** | Sentry + PostHog | ₹8,549 | ₹1,02,588 |
| **Other Services** | Various | ₹6,640 | ₹79,680 |
| **TOTAL** | Mixed | **₹2,64,196** | **₹31,70,352** |

**Why Hybrid is Best:**
- Uses best tool for each job
- More cost-effective than pure AWS
- Easier than full self-managed
- Good balance of control and convenience

---

## Scaling Costs by User Count

### Detailed Cost Progression

#### 100 Users (Month 1)
```
Infrastructure:
├── Vercel Hobby: FREE
├── Supabase Free: FREE
├── Cloudflare Free: FREE
└── Email (SendGrid Free): FREE

Total: ₹0/month (all free tiers)
Per User: ₹0
```

#### 1,000 Users (Month 2-3)
```
Infrastructure:
├── Vercel Pro: ₹1,660
├── Supabase Pro: ₹2,075
├── Cloudflare Pro: ₹1,660
├── SendGrid Essentials: ₹3,320
└── Domain: ₹83

Total: ₹8,798/month
Per User: ₹8.80
```

#### 5,000 Users (Month 4-6)
```
Infrastructure:
├── Vercel Pro: ₹1,660
├── Supabase Team: ₹24,917 (better performance)
├── Cloudflare Pro: ₹1,660
├── Redis Cloud (1GB): ₹4,150
├── SendGrid Pro: ₹7,466
├── EC2 (1 server): ₹11,205
└── Other: ₹2,490

Total: ₹53,548/month
Per User: ₹10.71
```

#### 10,000 Users (Month 7-9)
```
Infrastructure:
├── Vercel Pro: ₹1,660
├── Supabase Team: ₹24,917
├── Cloudflare Business: ₹16,600
├── Redis Cloud (5GB): ₹12,367
├── SendGrid Pro: ₹7,466
├── EC2 (2 servers): ₹22,410
├── Load Balancer: ₹2,075
├── Monitoring: ₹8,549
└── Other: ₹4,150

Total: ₹1,00,194/month
Per User: ₹10.02
```

#### 50,000 Users (Month 10-12)
```
Infrastructure:
├── Vercel Pro: ₹1,660
├── Supabase Enterprise: ₹1,65,917
├── Cloudflare Business: ₹16,600
├── Redis (5GB): ₹12,367
├── EC2 (5 servers): ₹50,415
├── Load Balancer: ₹2,075
├── Monitoring: ₹8,549
├── Search: ₹4,150
└── Other: ₹8,300

Total: ₹2,70,033/month
Per User: ₹5.40
```

#### 100,000 Users (Month 13+)
```
Infrastructure:
├── Frontend: ₹1,660
├── Database: ₹1,65,917
├── Compute: ₹61,586
├── Cache: ₹14,608
├── CDN: ₹16,600
├── Storage: ₹422
├── Email: ₹7,466
├── Search: ₹4,150
├── Monitoring: ₹12,450
├── Security: ₹6,225
├── Payment: ₹18,260
├── Load Balancer: ₹2,075
└── Other: ₹4,150

Total: ₹3,15,569/month
Per User: ₹3.16
```

### Cost Scaling Graph

| Users | Monthly Cost | Cost/User | % Change |
|-------|--------------|-----------|----------|
| 100 | ₹0 | ₹0.00 | - |
| 1,000 | ₹8,798 | ₹8.80 | - |
| 5,000 | ₹53,548 | ₹10.71 | +22% |
| 10,000 | ₹1,00,194 | ₹10.02 | -6% |
| 50,000 | ₹2,70,033 | ₹5.40 | -46% |
| **100,000** | **₹3,15,569** | **₹3.16** | **-42%** |
| 500,000 | ₹9,96,000 | ₹1.99 | -37% |
| 1,000,000 | ₹16,60,000 | ₹1.66 | -17% |

**Key Insight:** Cost per user DECREASES as you scale (economies of scale)

---

## Complete Monthly Budget (100,000 Users)

### Conservative Estimate (Recommended)

| Category | Service | Monthly (₹) | Annual (₹) | Notes |
|----------|---------|-------------|------------|-------|
| **Hosting & Compute** | | | | |
| Web Servers | EC2 t3.large × 3 | ₹16,683 | ₹2,00,196 | Frontend serving |
| API Servers | EC2 t3.xlarge × 3 | ₹34,860 | ₹4,18,320 | Backend API |
| WebSocket | EC2 t3.medium × 2 | ₹5,644 | ₹67,728 | Real-time |
| Workers | EC2 t3.medium × 2 | ₹5,644 | ₹67,728 | Background jobs |
| Load Balancer | AWS ALB | ₹2,075 | ₹24,900 | Traffic distribution |
| **Subtotal** | | **₹64,906** | **₹7,78,872** | |
| | | | | |
| **Database & Storage** | | | | |
| Database | Supabase Enterprise | ₹1,65,917 | ₹19,91,004 | PostgreSQL + Auth |
| Cache | ElastiCache Redis | ₹14,608 | ₹1,75,296 | Session & caching |
| File Storage | Cloudflare R2 | ₹422 | ₹5,064 | Images, files |
| **Subtotal** | | **₹1,80,947** | **₹21,71,364** | |
| | | | | |
| **CDN & Networking** | | | | |
| CDN | Cloudflare Business | ₹16,600 | ₹1,99,200 | Content delivery |
| **Subtotal** | | **₹16,600** | **₹1,99,200** | |
| | | | | |
| **Email & Notifications** | | | | |
| Email | SendGrid Pro | ₹7,466 | ₹89,592 | Transactional emails |
| Push | FCM + APNs | ₹0 | ₹0 | Mobile notifications |
| **Subtotal** | | **₹7,466** | **₹89,592** | |
| | | | | |
| **Search & Analytics** | | | | |
| Search | Algolia Standard | ₹4,150 | ₹49,800 | Fast search |
| Error Tracking | Sentry Team | ₹2,158 | ₹25,896 | Error monitoring |
| Analytics | PostHog (self-hosted) | ₹6,391 | ₹76,692 | Product analytics |
| **Subtotal** | | **₹12,699** | **₹1,52,388** | |
| | | | | |
| **Security & Backup** | | | | |
| Backups | Automated | ₹373 | ₹4,476 | Daily backups |
| Security Audit | Annual | ₹10,417 | ₹1,25,000 | Pen testing |
| SSL | Cloudflare | ₹0 | ₹0 | Included |
| **Subtotal** | | **₹10,790** | **₹1,29,476** | |
| | | | | |
| **Payment & Domain** | | | | |
| Payment Gateway | Stripe | ₹18,260 | ₹2,19,120 | ~4% of transactions |
| Domain | buyareco.com | ₹83 | ₹996 | Annual domain |
| **Subtotal** | | **₹18,343** | ₹2,20,116 | |
| | | | | |
| **Development Tools** | | | | |
| Version Control | GitHub Team | ₹1,660 | ₹19,920 | Code repository |
| API Testing | Postman (Free) | ₹0 | ₹0 | Free tier |
| **Subtotal** | | **₹1,660** | **₹19,920** | |
| | | | | |
| **GRAND TOTAL** | | **₹3,13,411** | **₹37,60,928** | |
| | | | | |
| **Per User Cost** | | **₹3.13** | **₹37.61** | |
| **Daily Cost** | | **₹10,447** | - | |

---

### Budget Optimization (Minimum Viable)

| Category | Service | Monthly (₹) | Savings | Notes |
|----------|---------|-------------|---------|-------|
| Compute | Smaller instances | ₹37,350 | ₹27,556 | Use t3.medium instead |
| Database | Self-managed PostgreSQL | ₹90,885 | ₹75,032 | More work, less cost |
| Cache | Redis Cloud 5GB | ₹12,367 | ₹2,241 | Managed Redis |
| CDN | Cloudflare Pro | ₹1,660 | ₹14,940 | Basic CDN |
| Email | AWS SES | ₹830 | ₹6,636 | Requires setup |
| Search | Typesense (self-hosted) | ₹5,561 | -₹1,411 | Open source |
| Monitoring | Free tiers | ₹0 | ₹12,699 | Basic monitoring |
| **TOTAL** | | **₹1,48,653** | **₹1,37,693** | 44% cheaper |

**Trade-offs:**
- More DevOps work required
- Less features (no advanced analytics)
- More time to maintain
- Higher technical risk

---

## One-Time Setup Costs

### Initial Setup (One-Time)

| Item | Cost (₹) | Notes |
|------|----------|-------|
| **Legal & Compliance** | | |
| Terms of Service | ₹15,000 | Legal document |
| Privacy Policy | ₹15,000 | GDPR compliant |
| Business Registration | ₹10,000 | Private Limited |
| GST Registration | ₹5,000 | India tax |
| **Subtotal** | **₹45,000** | |
| | | |
| **Mobile App Development** | | |
| Apple Developer Account | ₹8,217 | $99/year (Annual) |
| Google Play Developer | ₹2,075 | $25 (One-time) |
| **Subtotal** | **₹10,292** | |
| | | |
| **Design Assets** | | |
| Logo & Branding | ₹25,000 | Professional design |
| App Icons | ₹8,300 | All sizes |
| Marketing Materials | ₹16,600 | Banners, social |
| **Subtotal** | **₹49,900** | |
| | | |
| **Development Tools** | | |
| Code Editor Licenses | ₹0 | VS Code (free) |
| Design Tools (Figma) | ₹10,375 | Annual subscription |
| **Subtotal** | **₹10,375** | |
| | | |
| **GRAND TOTAL** | **₹1,15,567** | |

---

## Annual Cost Projection

### Year 1 Cost Breakdown

| Quarter | Users | Monthly Avg | Total Quarter | Notes |
|---------|-------|-------------|---------------|-------|
| Q1 (Jan-Mar) | 100-1,000 | ₹4,000 | ₹12,000 | MVP launch |
| Q2 (Apr-Jun) | 1K-5K | ₹30,000 | ₹90,000 | Growth phase |
| Q3 (Jul-Sep) | 5K-25K | ₹1,50,000 | ₹4,50,000 | Scaling up |
| Q4 (Oct-Dec) | 25K-100K | ₹2,50,000 | ₹7,50,000 | Full scale |
| **TOTAL YEAR 1** | | | **₹13,02,000** | |

### Year 2+ (Stable at 100K Users)

| Item | Monthly | Annual |
|------|---------|--------|
| Infrastructure | ₹3,13,411 | ₹37,60,928 |
| One-time Costs | - | ₹10,292 |
| **TOTAL YEAR 2** | | **₹37,71,220** |

### 3-Year Total Cost Projection

```
Year 1: ₹13,02,000 (variable growth)
Year 2: ₹37,71,220 (stable 100K users)
Year 3: ₹37,71,220 (stable 100K users)

3-Year Total: ₹88,44,440
Average per Year: ₹29,48,147
Average per Month: ₹2,45,679
```

---

## Cost Optimization Strategies

### Short-Term Optimizations (0-10K Users)

1. **Use Free Tiers Maximum**
   ```
   Savings: ₹50,000/month

   ├── Vercel Hobby (free up to 100GB)
   ├── Supabase Free (500MB database)
   ├── Cloudflare Free (unlimited bandwidth)
   ├── SendGrid Free (100 emails/day)
   └── GitHub Free (public repos)
   ```

2. **Delay Paid Services**
   ```
   Savings: ₹25,000/month

   ├── Use self-hosted analytics (Umami - free)
   ├── PostgreSQL full-text search (instead of Algolia)
   ├── Self-hosted monitoring (Prometheus)
   └── Manual backups (instead of automated)
   ```

### Medium-Term Optimizations (10K-50K Users)

1. **Reserved Instances**
   ```
   Savings: ₹15,000/month (25% discount)

   ├── AWS EC2 Reserved Instances (1-year commitment)
   ├── Save 30-40% on compute
   └── Pay upfront for discount
   ```

2. **CDN Optimization**
   ```
   Savings: ₹10,000/month

   ├── Aggressive caching (longer TTL)
   ├── Image optimization (WebP, compression)
   ├── Lazy loading
   └── Resource minification
   ```

### Long-Term Optimizations (100K+ Users)

1. **Database Optimization**
   ```
   Savings: ₹50,000/month

   ├── Query optimization (reduce DB load)
   ├── Better indexing
   ├── Read replica for reports
   └── Archive old data (cheaper storage)
   ```

2. **Custom Solutions**
   ```
   Savings: ₹1,00,000/month

   ├── Self-host everything (Kubernetes)
   ├── Bare metal servers (Hetzner, OVH)
   ├── Custom CDN (BunnyCDN)
   └── More DevOps work required
   ```

---

## Conclusion

### Final Cost Summary for 100,000 Users

```
MONTHLY COST: ₹3,13,411
ANNUAL COST: ₹37,60,928
PER USER COST: ₹3.13/month

Daily Breakdown:
├── Daily Cost: ₹10,447
├── Hourly Cost: ₹435
└── Per Minute: ₹7.26
```

### Key Takeaways

1. **Start Small, Scale Smart**
   - Month 1-3: FREE (use free tiers)
   - Month 4-6: ₹50,000/month (5K users)
   - Month 7-12: ₹1,50,000/month (25K users)
   - Month 13+: ₹3,13,411/month (100K users)

2. **Biggest Cost Drivers**
   - Database: 53% of total cost (₹1,65,917)
   - Compute: 20% of total cost (₹61,586)
   - CDN: 5% of total cost (₹16,600)

3. **Where to Save Money**
   - Use Cloudflare R2 instead of S3 (saves ₹30,000/month)
   - Self-host analytics (saves ₹70,000/month)
   - Use free tiers initially (saves ₹50,000/month)

4. **Where NOT to Save Money**
   - Database (reliability is critical)
   - Monitoring (need to catch issues fast)
   - Backups (data loss is catastrophic)

5. **Economies of Scale**
   - Cost/user decreases as you grow
   - 1,000 users: ₹8.80/user
   - 100,000 users: ₹3.13/user (65% cheaper)

---

**Document Version:** 1.0
**Last Updated:** November 2025
**Currency:** Indian Rupees (₹)
**Exchange Rate:** 1 USD = ₹83

---

## Next Steps

1. **Immediate (This Month)**
   - Use 100% free tiers
   - Cost: ₹0/month

2. **Short-term (1-3 Months)**
   - Upgrade to paid plans as needed
   - Budget: ₹10,000-50,000/month

3. **Medium-term (4-12 Months)**
   - Scale infrastructure
   - Budget: ₹50,000-2,00,000/month

4. **Long-term (12+ Months)**
   - Full production setup
   - Budget: ₹3,00,000+/month

---

For questions or updates, please refer to the Product Roadmap document.
