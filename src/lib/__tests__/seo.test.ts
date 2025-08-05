import { seo } from '../seo'

describe('SEO Service', () => {
  beforeEach(() => {
    // Reset any state before each test
  })

  describe('getPageMetaData', () => {
    it('should return default meta data for unknown path', () => {
      const metaData = seo.getPageMetaData('/unknown-path')
      
      expect(metaData.title).toBe('Alo17 - Türkiye\'nin En Büyük İlan Sitesi')
      expect(metaData.description).toContain('Alo17 ile alım, satım')
      expect(metaData.keywords).toContain('ilan')
    })

    it('should return specific meta data for home page', () => {
      const metaData = seo.getPageMetaData('/')
      
      expect(metaData.title).toBe('Alo17 - Türkiye\'nin En Büyük İlan Sitesi')
      expect(metaData.ogType).toBe('website')
      expect(metaData.structuredData).toBeDefined()
    })

    it('should return specific meta data for listings page', () => {
      const metaData = seo.getPageMetaData('/ilanlar')
      
      expect(metaData.title).toBe('İlanlar - Alo17')
      expect(metaData.description).toContain('Binlerce ilan')
      expect(metaData.keywords).toContain('ilanlar')
    })

    it('should return noindex for login page', () => {
      const metaData = seo.getPageMetaData('/giris')
      
      expect(metaData.robots).toBe('noindex, nofollow')
    })
  })

  describe('createMetaData', () => {
    it('should create meta data with custom title and description', () => {
      const metaData = seo.createMetaData(
        'Custom Title',
        'Custom Description',
        { keywords: ['test', 'custom'] }
      )
      
      expect(metaData.title).toBe('Custom Title')
      expect(metaData.description).toBe('Custom Description')
      expect(metaData.keywords).toEqual(['test', 'custom'])
    })

    it('should merge with default meta data', () => {
      const metaData = seo.createMetaData('Custom Title', 'Custom Description')
      
      expect(metaData.title).toBe('Custom Title')
      expect(metaData.description).toBe('Custom Description')
      expect(metaData.author).toBe('Alo17')
      expect(metaData.robots).toBe('index, follow')
    })
  })

  describe('createListingMetaData', () => {
    it('should create listing meta data with all required fields', () => {
      const metaData = seo.createListingMetaData(
        'iPhone 13 Pro',
        'Yeni iPhone 13 Pro satılık',
        15000,
        'elektronik',
        'İstanbul',
        ['/image1.jpg', '/image2.jpg'],
        'listing-123'
      )
      
      expect(metaData.title).toContain('iPhone 13 Pro')
      expect(metaData.title).toContain('15000₺')
      expect(metaData.title).toContain('elektronik')
      expect(metaData.title).toContain('İstanbul')
      expect(metaData.ogType).toBe('product')
      expect(metaData.structuredData).toBeDefined()
    })

    it('should include structured data for product', () => {
      const metaData = seo.createListingMetaData(
        'Test Product',
        'Test Description',
        1000,
        'test-category',
        'Test Location',
        ['/test-image.jpg'],
        'test-id'
      )
      
      expect(metaData.structuredData).toEqual({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'Test Product',
        description: 'Test Description',
        image: ['/test-image.jpg'],
        offers: {
          '@type': 'Offer',
          price: 1000,
          priceCurrency: 'TRY',
          availability: 'https://schema.org/InStock'
        },
        category: 'test-category',
        location: {
          '@type': 'Place',
          name: 'Test Location'
        }
      })
    })
  })

  describe('createCategoryMetaData', () => {
    it('should create category meta data with listing count', () => {
      const metaData = seo.createCategoryMetaData(
        'Elektronik',
        'Elektronik ürünler kategorisi',
        150
      )
      
      expect(metaData.title).toContain('Elektronik İlanları')
      expect(metaData.title).toContain('150 ilan')
      expect(metaData.description).toContain('150 ilan bulunuyor')
      expect(metaData.keywords).toContain('Elektronik')
    })

    it('should include structured data for collection page', () => {
      const metaData = seo.createCategoryMetaData(
        'Test Category',
        'Test Description',
        50
      )
      
      expect(metaData.structuredData).toEqual({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Test Category İlanları',
        description: 'Test Description',
        numberOfItems: 50
      })
    })
  })

  describe('createSearchMetaData', () => {
    it('should create search meta data with query and result count', () => {
      const metaData = seo.createSearchMetaData('iPhone', 25)
      
      expect(metaData.title).toContain('"iPhone" Arama Sonuçları')
      expect(metaData.title).toContain('25 ilan')
      expect(metaData.description).toContain('"iPhone" için 25 ilan bulundu')
      expect(metaData.robots).toBe('noindex, follow')
      expect(metaData.canonical).toContain('alo17.com/arama')
    })
  })

  describe('generateMetaTags', () => {
    it('should generate basic meta tags', () => {
      const metaData = seo.createMetaData('Test Title', 'Test Description')
      const metaTags = seo.generateMetaTags(metaData)
      
      expect(metaTags).toContain('<title>Test Title</title>')
      expect(metaTags).toContain('<meta name="description" content="Test Description" />')
      expect(metaTags).toContain('<meta property="og:title" content="Test Title" />')
      expect(metaTags).toContain('<meta property="og:description" content="Test Description" />')
    })

    it('should include keywords when provided', () => {
      const metaData = seo.createMetaData('Test Title', 'Test Description', {
        keywords: ['test', 'keyword']
      })
      const metaTags = seo.generateMetaTags(metaData)
      
      expect(metaTags).toContain('<meta name="keywords" content="test, keyword" />')
    })

    it('should include canonical URL when provided', () => {
      const metaData = seo.createMetaData('Test Title', 'Test Description', {
        canonical: 'https://alo17.com/test'
      })
      const metaTags = seo.generateMetaTags(metaData)
      
      expect(metaTags).toContain('<link rel="canonical" href="https://alo17.com/test" />')
    })

    it('should include structured data when provided', () => {
      const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Test Site'
      }
      
      const metaData = seo.createMetaData('Test Title', 'Test Description', {
        structuredData
      })
      const metaTags = seo.generateMetaTags(metaData)
      
      expect(metaTags).toContain('<script type="application/ld+json">')
      expect(metaTags).toContain('"@context":"https://schema.org"')
    })
  })

  describe('generateSitemapUrls', () => {
    it('should generate sitemap URLs with correct structure', () => {
      const urls = seo.generateSitemapUrls()
      
      expect(urls).toBeInstanceOf(Array)
      expect(urls.length).toBeGreaterThan(0)
      
      const homeUrl = urls.find(url => url.url === 'https://alo17.com')
      expect(homeUrl).toBeDefined()
      expect(homeUrl?.priority).toBe(1.0)
      expect(homeUrl?.changefreq).toBe('daily')
    })
  })

  describe('generateRobotsTxt', () => {
    it('should generate robots.txt content', () => {
      const robotsTxt = seo.generateRobotsTxt()
      
      expect(robotsTxt).toContain('User-agent: *')
      expect(robotsTxt).toContain('Allow: /')
      expect(robotsTxt).toContain('Sitemap: https://alo17.com/sitemap.xml')
      expect(robotsTxt).toContain('Disallow: /admin/')
      expect(robotsTxt).toContain('Disallow: /api/')
    })
  })
}) 