import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.page.html',
  styleUrls: ['./blog.page.scss'],
})
export class BlogPage implements OnInit {
  searchQuery: string = '';
  blogPosts: any[] = [
  // Array of blog post objects, each with metadata (title, summary, image, & URL)
    {
      blog: 'Blog 1',
      title: 'Everything You Need to Know About Visiting Cologne Cathedral',
      summary: 'Standing proudly on the banks of the...',
      time: '2024-12-10',
      image: '/assets/blog1.JPG',
      url: 'https://auslanderblog.com/complete-cologne-cathedral-guide/',
    },
    {
      blog: 'Blog 2',
      title: 'A 1st Timer’s Guide to Germany Travel: Where to Go, When to Go & More!',
      summary: 'While most commonly associated with beers...',
      time: '2024-08-30',
      image: '/assets/blog4.JPG',
      url: 'https://happytowander.com/germany-travel-guide/',
    },
    {
      blog: 'Blog 3',
      title: '12 Coolest Things to Do in Dresden',
      summary: 'Once known as the “Florence of the...',
      time: '2021-10-03',
      image: '/assets/blog2.JPG',
      url: 'https://auslanderblog.com/dresden-best-things-to-do/',
    },
    {
      blog: 'Blog 4',
      title: '10-Day Bavarian Alps & Tyrolean Alps Road Trip Itinerary, Germany & Austria',
      summary: 'This Bavarian Alps and Tyrolean Alps...',
      time: '2024-08-22',
      image: '/assets/blog5.JPG',
      url: 'https://www.moonhoneytravel.com/bavarian-alps-tyrolean-alps-road-trip-itinerary/',
    },
    {
      blog: 'Blog 5',
      title: '15 Fascinating Museums and Historical Attractions to See in Berlin',
      summary: 'Steeped in important history dating...',
      time: '2024-02-02',
      image: '/assets/blog3.JPG',
      url: 'https://auslanderblog.com/berlin-best-museums-historic-attractions/',
    },
    {
      blog: 'Blog 6',
      title: 'How to Visit Lake Eibsee in Bavaria, Germany',
      summary: 'Eibsee is a mountain lake at ...',
      time: '2024-11-01',
      image: '/assets/blog6.JPG',
      url: 'https://www.moonhoneytravel.com/lake-eibsee-germany/',
    },
    {
      blog: 'Blog 7',
      title: 'Exploring the gemstone country around Idar-Oberstein',
      summary: 'Over the last ten years, I have...',
      time: '2024-08-20',
      image: '/assets/blog7.JPG',
      url: 'https://www.creativelena.com/en/travel-blog/gemstone-country-idar-oberstein/',
    },
    {
      blog: 'Blog 8',
      title: 'UNESCO World Heritage Trip in Germany: Erfurt, Weimar and the Wartburg region',
      summary: 'Over the last ten years, I have...',
      time: '2024-07-30',
      image: '/assets/blog8.JPG',
      url: 'https://www.creativelena.com/en/travel-blog/unesco-travel-germany-erfurt-weimar-wartburg/',
    }
  ];
  // Filtered blog posts, initially containing all posts
  filteredPosts = [...this.blogPosts];


  // Retrieve saved language from localStorage
  constructor(private translate: TranslateService) {
    const savedLanguage = localStorage.getItem('appLanguage') || 'en';
    this.translate.use(savedLanguage);
  }

  ngOnInit() {}

  // Open a blog post in a new browser tab
  openPost(url: string) {
    window.open(url, '_blank');
  }

  // Filter blog posts based on the search query
  filterPosts() {
    const query = this.searchQuery.toLowerCase();
    this.filteredPosts = this.blogPosts.filter(post =>
      post.title.toLowerCase().includes(query)
    );
  }

  // Handle segment changes (Recent posts)
  onSegmentChange(event: any) {
    const filter = event.detail.value;
    if (filter === 'recent') {
      this.filteredPosts = this.getRecentPosts(3);
    } else {
      this.filteredPosts = [...this.blogPosts];
    }
    if (this.searchQuery) {
      this.filterPosts();
    }
  }

  // Get the most recent blog posts, limited by a specified number
  getRecentPosts(limit: number) {
    return this.blogPosts
      .map(post => ({
        ...post,
        parsedDate: new Date(post.time).getTime(),
      }))
      .sort((a, b) => b.parsedDate - a.parsedDate)
      .slice(0, limit)
      .map(({ parsedDate, ...cleanPost }) => cleanPost);
  }

  // Use the browser's speech synthesis API to read a blog post aloud
  readPost(title: string, blog: string, summary: string) {
    const speech = new SpeechSynthesisUtterance();
    speech.text = `${title}. ${blog}. ${summary}`;
    speech.lang = this.translate.currentLang === 'de' ? 'de-DE' : 'en-US';
    window.speechSynthesis.speak(speech);
  }
}
