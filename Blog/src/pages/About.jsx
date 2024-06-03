export default function About() {
  return (
    <div className='min h-screen flex justify-center items-center'>
      <div className='max-w-4xl p-20 shadow-lg shadow-slate-800 dark:shadow-orange-500 mt-[-100px]'>
        <div>
          <h1 className='text-4xl font-semibold italic'>
            About Jef's Blog
          </h1>
          <div className='text-md text-gray-500 flex flex-col gap-6 mt-6'>
            <p>
              Hi there! I'm Jef, and I'm thrilled to have you here on my personal blog. This is a digital space of mine where I share my thoughts, experiences, and insights on a variety of topics that I'm passionate about. Jef's Blog is a reflection of my multifaceted interests. I believe that life is too short to be confined to a single niche, which is why you'll find a rich tapestry of content here. From exploring exotic travel destinations to delving into the latest tech trends.
            </p>

            <p>
              One of the most rewarding aspects of maintaining this blog is engaging with my readers. I love hearing your thoughts, feedback, and stories. Feel free to leave comments on my posts, share your own experiences, or reach out to me directly. Your engagement helps me grow and keeps me motivated to continue creating content that matters.
            </p>

            <p>
              Thank you for stopping by Jef's Blog. Your support and readership mean the world to me. Whether you're a regular visitor or a first-time reader, I appreciate you taking the time to explore my little corner of the internet. Here's to sharing many more stories and adventures together!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}