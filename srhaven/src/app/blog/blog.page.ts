import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.page.html',
  styleUrls: ['./blog.page.scss'],
})
export class BlogPage implements OnInit {
  searchQuery: string = '';
  blogPosts: any[] = [
    {
      blog: 'Blog 1',
      title: 'Everything You Need to Know About Visiting Cologne Cathedral',
      summary: 'Standing proudly on the banks of the...',
      time: '2024-12-10', // ISO format for consistent date parsing
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
    },
  ];
  filteredPosts = [...this.blogPosts];

  constructor() {}

  ngOnInit() {}

  openPost(url: string) {
    window.open(url, '_blank');
  }

  filterPosts() {
    const query = this.searchQuery.toLowerCase();
    this.filteredPosts = this.filteredPosts.filter(post =>
      post.title.toLowerCase().includes(query)
    );
  }

  onSegmentChange(event: any) {
    const filter = event.detail.value;
    if (filter === 'recent') {
      this.filteredPosts = this.getRecentPosts(3); // Show top 5 recent blogs
    } else {
      this.filteredPosts = [...this.blogPosts]; // Show all blogs
    }
    // Apply search filter after segment change
    if (this.searchQuery) {
      this.filterPosts();
    }
  }

  getRecentPosts(limit: number) {
    return this.blogPosts
      .map(post => ({
        ...post,
        parsedDate: new Date(post.time).getTime(), // Parse date for sorting
      }))
      .sort((a, b) => b.parsedDate - a.parsedDate) // Sort by descending date
      .slice(0, limit) // Get the top N recent posts
      .map(({ parsedDate, ...cleanPost }) => cleanPost); // Remove `parsedDate` before returning
  }

  readPost(title: string, blog: string, summary: string) {
    const speech = new SpeechSynthesisUtterance();
    speech.text = `${title}. ${blog}. ${summary}`;
    speech.lang = 'en-US'; // Adjust language if needed
    speech.rate = 1; // Adjust speed (0.1 to 10)
    speech.pitch = 1; // Adjust pitch (0 to 2)

    window.speechSynthesis.speak(speech);
  }

}
