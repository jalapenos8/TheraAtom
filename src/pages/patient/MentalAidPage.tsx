const MentalAidPage = () => {
  const resources = [
    {
      title: 'Cancer Support Hotline',
      phone: '1-800-123-4567',
      hours: '24/7',
      description: 'Free, confidential support for cancer patients and their families.',
    },
    {
      title: 'Mental Health Crisis Line',
      phone: '1-800-273-8255',
      hours: '24/7',
      description: 'Immediate support for those experiencing mental health crisis.',
    },
    {
      title: 'Therapy Services',
      phone: '1-888-456-7890',
      hours: 'Mon-Fri: 8am-5pm',
      description: 'Schedule an appointment with a therapist specializing in cancer patient support.',
    },
    {
      title: 'Support Groups',
      phone: '1-877-987-6543',
      hours: 'Mon-Fri: 9am-4pm',
      description: 'Information about local and online support groups for cancer patients.',
    },
  ];

  const articles = [
    {
      title: 'Coping with a Cancer Diagnosis',
      description: 'Strategies for managing the emotional impact of receiving a cancer diagnosis.',
      url: '#',
    },
    {
      title: 'Managing Anxiety During Treatment',
      description: 'Techniques for reducing anxiety before and during medical treatments.',
      url: '#',
    },
    {
      title: 'Talking to Family About Your Diagnosis',
      description: 'Tips for communicating with loved ones about your cancer journey.',
      url: '#',
    },
    {
      title: 'Finding Meaning After Diagnosis',
      description: 'Perspectives on finding purpose and meaning after a life-changing diagnosis.',
      url: '#',
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Mental Health Support</h1>
        <p className="text-gray-600">
          Resources and support for your mental and emotional well-being during treatment
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Phone Support */}
        <div className="card">
          <h2 className="text-lg font-medium text-text mb-4">
            Phone Support & Crisis Lines
          </h2>
          <div className="space-y-4">
            {resources.map((resource, index) => (
              <div key={index} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                <h3 className="font-medium text-primary">{resource.title}</h3>
                <p className="text-lg font-bold">{resource.phone}</p>
                <p className="text-sm text-gray-500">Hours: {resource.hours}</p>
                <p className="mt-1 text-gray-700">{resource.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Articles */}
        <div className="card">
          <h2 className="text-lg font-medium text-text mb-4">
            Helpful Articles
          </h2>
          <div className="space-y-4">
            {articles.map((article, index) => (
              <div key={index} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                <h3 className="font-medium text-primary">{article.title}</h3>
                <p className="mt-1 text-gray-700">{article.description}</p>
                <div className="mt-2">
                  <a
                    href={article.url}
                    className="text-secondary hover:underline text-sm font-medium"
                  >
                    Read Article →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Appointment Request */}
        <div className="md:col-span-2 card">
          <h2 className="text-lg font-medium text-text mb-4">
            Request Mental Health Consultation
          </h2>
          <p className="text-gray-700 mb-4">
            If you would like to speak with a mental health professional, please
            fill out this form and we will contact you to schedule an appointment.
          </p>
          <form className="space-y-4">
            <div>
              <label htmlFor="reason" className="label">
                Reason for Consultation
              </label>
              <select id="reason" className="input">
                <option value="">Select a reason</option>
                <option value="anxiety">Anxiety</option>
                <option value="depression">Depression</option>
                <option value="coping">Coping with diagnosis</option>
                <option value="family">Family concerns</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="label">
                Additional Information
              </label>
              <textarea
                id="message"
                rows={3}
                className="input"
                placeholder="Please share any additional details that would help us prepare for your consultation."
              ></textarea>
            </div>
            <div>
              <label htmlFor="contact-preference" className="label">
                Preferred Contact Method
              </label>
              <div className="space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="contact-preference"
                    value="phone"
                    className="form-radio"
                  />
                  <span className="ml-2">Phone</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="contact-preference"
                    value="email"
                    className="form-radio"
                  />
                  <span className="ml-2">Email</span>
                </label>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MentalAidPage; 