# CMS Quarsa - Technical Specification

## Project Overview

**CMS Quarsa** adalah website perusahaan Quasar Capital yang lengkap dengan sistem Content Management System (CMS) built-in. Proyek ini dibangun menggunakan React dengan TypeScript dan mengintegrasikan Supabase sebagai backend untuk manajemen konten real-time.

## Teknologi Stack

### Frontend
- **Framework**: React 18.2.0 dengan TypeScript
- **Build Tool**: Vite 4.4.5
- **Styling**: Tailwind CSS 3.3.3 dengan animasi plugin
- **UI Components**: Radix UI primitives untuk komponen accessible
- **Routing**: React Router v7
- **State Management**: Custom hooks dan React Context
- **Animations**: Framer Motion 10.16.4
- **Icons**: Lucide React

### Backend & Database
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth dengan UI helpers
- **Real-time**: Supabase real-time subscriptions
- **Storage**: Supabase Storage untuk media assets

### Additional Libraries
- **Drag & Drop**: @dnd-kit untuk sorting functionality
- **Forms**: Custom form components dengan validation
- **Notifications**: Sonner untuk toast notifications
- **SEO**: React Helmet Async untuk meta tags
- **Security**: Google reCAPTCHA v3

## Arsitektur Aplikasi

### Struktur Direktori
```
src/
├── components/
│   ├── admin/           # Admin panel components (16 components)
│   ├── ui/              # Reusable UI components (12 components)
│   └── *.tsx            # Core site components
├── pages/
│   └── AdminApp.tsx     # Admin panel entry point
├── hooks/               # Custom hooks (14 hooks)
├── lib/                 # Utility functions
├── contexts/            # React contexts
└── types/               # TypeScript definitions
```

### Komponen Utama

#### 1. Admin Panel Components
- **Dashboard.tsx**: Overview dashboard dengan statistik
- **AdminLayout.tsx**: Layout admin panel dengan sidebar
- **HeroEditor.tsx**: Editor untuk hero section
- **AboutEditor.tsx**: Editor untuk halaman about us
- **ServicesEditor.tsx**: Editor untuk layanan
- **TeamEditor.tsx**: Editor untuk team members
- **ClientsEditor.tsx**: Editor untuk client logos
- **GalleryEditor.tsx**: Editor untuk image gallery
- **CredentialsEditor.tsx**: Editor untuk certifications
- **ContactEditor.tsx**: Editor untuk contact information
- **SettingsEditor.tsx**: Pengaturan perusahaan
- **HeroSlidesEditor.tsx**: Editor untuk hero slides
- **HeroSEOConfig.tsx**: Konfigurasi SEO untuk hero
- **HeroModal.tsx**: Modal untuk hero management
- **DeleteConfirmationModal.tsx**: Modal konfirmasi delete

#### 2. UI Components (shadcn/ui pattern)
- **Button.tsx**: Custom button dengan variants
- **Card.tsx**: Card component dengan header/content
- **Dialog.tsx**: Modal dialogs
- **Label.tsx**: Form labels
- **Separator.tsx**: Visual separators
- **Tabs.tsx**: Tab navigation
- **Slot.tsx**: Component composition
- **Badge.tsx**: Status badges

#### 3. Site Components
- **SEO.tsx**: Meta tags management
- **HeroImageSlider.tsx**: Hero section dengan image slider
- **BlurText.tsx**: Animated text blur effect
- **InfiniteSlider.tsx**: Infinite scrolling animation
- **ServicesMotion.tsx**: Animated service cards
- **ServiceDetailModal.tsx**: Service detail modal
- **CookieConsent.tsx**: Cookie consent banner

### Custom Hooks Architecture

#### Content Management Hooks
- **useContent()**: Main content aggregator
- **useHeroContent()**: Hero section data
- **useAboutContent()**: About page content
- **useServicesContent()**: Services data
- **useTeamContent()**: Team members data
- **useClientsContent()**: Client logos data
- **useGalleryContent()**: Gallery images data
- **useCredentialsContent()**: Certifications data
- **useContactContent()**: Contact information
- **useCompanySettings()**: Company settings

#### Admin Hooks
- **useAdminContent()**: Admin panel content management
- **useDashboardContent()**: Dashboard statistics
- **useSettingsContent()**: Settings management
- **useHeroSlides()**: Hero slides management

## Database Schema

### Main Tables
1. **hero**: Hero section content
2. **about**: About page content
3. **services**: Services data dengan categories
4. **team**: Team members information
5. **clients**: Client logos dengan URLs
6. **gallery**: Gallery images dengan categories
7. **credentials**: Certifications dan awards
8. **contact**: Contact information
9. **company_settings**: Global settings
10. **hero_slides**: Hero slide images

### Security Features
- **Row Level Security (RLS)** policies untuk setiap table
- **Authentication** terintegrasi dengan Supabase Auth
- **reCAPTCHA** protection untuk forms
- **Environment variables** untuk sensitive data

## Performance Optimizations

### Code Splitting
- **Lazy Loading**: Admin panel diload on-demand
- **Vendor Chunking**: Third-party libraries di-bundle terpisah
- **Feature-based Chunking**: Komponen admin di-bundle terpisah

### Asset Optimization
- **Image Optimization**: Lazy loading untuk images
- **Bundle Analysis**: Optimal bundle sizes
- **Caching Strategy**: Content caching dengan refresh intervals

### Build Configuration
```typescript
// vite.config.ts key features
- Code splitting dengan vendor chunks
- Optimized production builds
- Asset compression dan optimization
- Development server dengan fast refresh
```

## Features Implementation

### 1. Content Management System
- **Full CRUD Operations** untuk semua content types
- **Real-time Updates** dengan Supabase subscriptions
- **Drag-and-Drop** untuk content ordering
- **Color Customization** dengan visual pickers
- **Image Upload** dengan Supabase Storage
- **SEO Configuration** untuk setiap section

### 2. Frontend Features
- **Responsive Design** dengan Tailwind CSS
- **Dark Mode Support** (configured but not implemented)
- **Animations** dengan Framer Motion
- **Infinite Scrolling** untuk client logos
- **Modal Dialogs** untuk detailed views
- **Interactive Forms** dengan validation
- **SEO Optimized** dengan dynamic meta tags

### 3. Admin Features
- **Authentication System** dengan role-based access
- **Dashboard** dengan content statistics
- **Content Editor** dengan live preview
- **Media Management** dengan file upload
- **Settings Management** untuk company info
- **Publish/Unpublish** workflow
- **Content History** dan versioning

## Security Implementation

### Authentication & Authorization
- **Supabase Auth** untuk user management
- **JWT Tokens** untuk session management
- **Protected Routes** untuk admin panel
- **Role-based Access Control**

### Data Protection
- **RLS Policies** untuk database access control
- **Input Validation** untuk form submissions
- **SQL Injection Prevention** dengan parameterized queries
- **XSS Protection** dengan React's built-in sanitization

### Security Headers
- **Content Security Policy** (CSP)
- **X-Frame-Options**
- **X-Content-Type-Options**
- **Referrer Policy**

## Development Workflow

### Local Development
```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # ESLint checking
```

### Environment Variables
- **VITE_SUPABASE_URL**: Supabase project URL
- **VITE_SUPABASE_ANON_KEY**: Supabase anonymous key
- **VITE_RECAPTCHA_SITE_KEY**: Google reCAPTCHA site key

### Build Process
1. **TypeScript Compilation** dengan strict type checking
2. **Vite Bundling** dengan code splitting
3. **Asset Optimization** dan compression
4. **Static Generation** untuk production

## Deployment Configuration

### Vercel Deployment
- **vercel.json** untuk SPA configuration
- **Automatic builds** dari GitHub repository
- **Environment variables** management
- **Custom domains** configuration

### Build Optimization
- **Tree shaking** untuk unused code removal
- **Minification** untuk production builds
- **Asset optimization** untuk images dan fonts
- **CDN delivery** untuk static assets

## Monitoring & Analytics

### Performance Monitoring
- **Bundle size analysis** dengan Vite bundle analyzer
- **Core Web Vitals** monitoring
- **Error tracking** (configured but not implemented)
- **Performance metrics** collection

### SEO Features
- **Dynamic meta tags** generation
- **Structured data** implementation
- **Sitemap generation** (manual)
- **Open Graph** tags untuk social sharing

## Future Enhancements

### Planned Features
1. **Form submissions** database integration
2. **Enhanced analytics** dashboard
3. **Multi-language support**
4. **Advanced media library**
5. **Content scheduling**
6. **User activity logs**
7. **Backup system** untuk content
8. **API integration** untuk external services

### Technical Debt
1. **Form submissions** currently use email only
2. **Testing framework** belum diimplementasi
3. **Error boundaries** perlu ditambahkan
4. **Progressive Web App** features
5. **Accessibility audit** dan improvements

## Conclusion

CMS Quarsa adalah solusi website perusahaan yang modern dengan CMS terintegrasi, dibangun dengan best practices React development. Arsitektur yang modular dan scalable memungkinkan untuk maintenance yang mudah dan future enhancements. Sistem ini sudah production-ready dengan fitur lengkap untuk content management dan user experience yang optimal.