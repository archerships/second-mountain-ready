import React, { useState, useEffect } from 'react';
import { Mail, Phone, Plus, Trash2, Send, CheckCircle, Facebook, MapPin } from 'lucide-react';
import './App.css';

interface VideoLink {
  id: string;
  url: string;
  title: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  glp1Duration: string;
  fitnessGoals: string;
}

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setAdminLoginError] = useState(false);
  const [videos, setVideos] = useState<VideoLink[]>([
    { id: '1', url: 'https://www.youtube.com/embed/8BcPHWGnO44', title: '30-Minute Senior Chair Workout' },
    { id: '2', url: 'https://www.youtube.com/embed/A2wp8EtJIew', title: '15-Minute Low Impact Seniors Workout' },
    { id: '3', url: 'https://www.youtube.com/embed/6F5B3hPx7KU', title: '15-Minute Simple Seated Routine' },
    { id: '4', url: 'https://www.youtube.com/embed/b2DYU7ZQgN0', title: '5 Best Functional Exercises for Seniors' },
    { id: '5', url: 'https://www.youtube.com/embed/UeU_jdHo_e8', title: 'Gentle Functional Workout for Beginners' }
  ]);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    glp1Duration: '',
    fitnessGoals: ''
  });

  // Persist videos to localStorage
  useEffect(() => {
    try {
      const savedVideos = localStorage.getItem('trainer-videos');
      if (savedVideos) {
        setVideos(JSON.parse(savedVideos));
      }
    } catch (e) {
      console.warn("localStorage reading blocked or unavailable:", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('trainer-videos', JSON.stringify(videos));
    } catch (e) {
      console.warn("localStorage writing blocked or unavailable:", e);
    }
  }, [videos]);

  const handleAdminClick = () => {
    if (isAdmin) {
      setIsAdmin(false);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default prototype password
    if (adminPassword === 'heather2026') {
      setIsAdmin(true);
      setShowLoginModal(false);
      setAdminPassword('');
      setAdminLoginError(false);
    } else {
      setAdminLoginError(true);
    }
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoUrl || !newVideoTitle) return;
    
    // Extract YouTube ID if possible
    let finalUrl = newVideoUrl;
    const ytMatch = newVideoUrl.match(/(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/(?:watch\?v=)?(.+)/);
    if (ytMatch && ytMatch[1]) {
      finalUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
    }

    const newVideo: VideoLink = {
      id: Date.now().toString(),
      url: finalUrl,
      title: newVideoTitle
    };
    setVideos([...videos, newVideo]);
    setNewVideoUrl('');
    setNewVideoTitle('');
  };

  const handleDeleteVideo = (id: string) => {
    setVideos(videos.filter(v => v.id !== id));
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbz6O2CcEnkt-Nfrp-Xef6ZpqWsL-cnUdgsp-ZrKsqE6g_u8cmMhVlu5vvdkZd5QsRiHbA/exec';
    
    console.log('Submitting form data to Google Sheets:', formData);
    
    try {
      const response = await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors', // Apps Script requires no-cors for simple POST
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      console.log('Form submission response:', response);
      setIsSubmitted(true);
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        glp1Duration: '',
        fitnessGoals: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting the form. Please try again.');
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <div className="logo">Second Mountain Ready</div>
          <button 
            className="btn btn-primary" 
            onClick={handleAdminClick}
            style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
          >
            {isAdmin ? 'Logout' : 'Admin'}
          </button>
        </div>
      </header>

      {showLoginModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Admin Login</h3>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter admin password"
                  autoFocus
                />
                {loginError && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.5rem' }}>Incorrect password.</p>}
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Login</button>
                <button 
                  type="button" 
                  className="btn" 
                  onClick={() => {
                    setShowLoginModal(false);
                    setAdminPassword('');
                    setAdminLoginError(false);
                  }}
                  style={{ flex: 1, backgroundColor: '#cbd5e0' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <section className="hero">
        <div className="container">
          <h1>Navigate Your Second Mountain</h1>
          <p>
            Specialized physical training for seniors navigating life transitions 
            and GLP-1 therapy journeys. Reclaim your vitality and strength with Heather Cooper.
          </p>
          <p style={{ fontSize: '0.7rem', opacity: 0.5, marginTop: '-1rem', marginBottom: '2rem' }}>v1.0.4 - Updated Contact Info</p>
          <a href="#intake" className="btn btn-primary">Start Your Journey</a>
        </div>
      </section>

      <section className="container">
        <div className="profile">
          <div style={{ borderRadius: '1rem', overflow: 'hidden', height: '500px' }}>
             <img 
               src="heather-cooper.jpg" 
               alt="Heather Cooper - Personal Trainer" 
               style={{ width: '100%', height: '100%', objectFit: 'cover' }}
             />
          </div>
          <div className="profile-content">
            <h2>Heather Cooper</h2>
            <p>
              Heather brings to the table a well-rounded skill set to help you reach your health and fitness goals. 
              Her philosophy is that each client is unique, as are their coaching needs. From building strength 
              and flexibility to nutrition coaching that is rooted in behavior-based change, she can work 
              alongside you to build lasting health habits that will allow you to look, move and feel better, 
              no more crazy diets or exercise regimens.
            </p>
            <p style={{ marginTop: '1rem' }}>
              Heather is a wife, a mother of two teenagers and one very active dog and an independent business owner. 
              Every day Heather looks for one way to nourish her body and mind by either walking the dog in the 
              foothills, throwing around some weights, jogging around the North End or climbing the very safe 
              and secure routes inside the climbing gym.
            </p>
            <p style={{ marginTop: '1rem', fontWeight: '600' }}>
              Consistency is key to lasting change. How can I help you achieve your goals?
            </p>
            
            <div style={{ marginTop: '2rem' }}>
              <h4 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>Additional Certifications:</h4>
              <ul style={{ listStyleType: 'none', fontSize: '0.9rem', color: 'var(--text-light)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem 1rem' }}>
                <li>• Moving for Better Balance</li>
                <li>• TRX Suspension Training</li>
                <li>• NCSF-PT</li>
                <li>• Group X Instructor</li>
                <li>• Bulgarian Bags</li>
                <li>• Precision Nutrition Level 1</li>
                <li>• Precision Nutrition Level 2</li>
              </ul>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Mail className="text-primary" /> <span>heather.cooper35@gmail.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Phone className="text-primary" /> <span>(208) 283-3707</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <MapPin className="text-primary" /> <span>199 N. Capitol Blvd. Suite 301 Boise, ID 83702</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Facebook className="text-primary" /> <a href="https://www.facebook.com/cooperbits/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Facebook: cooperbits</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: '#edf2f7' }}>
        <div className="container">
          <h2 className="section-title">Training Videos</h2>
          
          {isAdmin && (
            <div className="form-container" style={{ marginBottom: '3rem', padding: '2rem' }}>
              <h3>Add Training Video</h3>
              <form onSubmit={handleAddVideo} style={{ marginTop: '1rem' }}>
                <div className="form-group">
                  <input 
                    type="text" 
                    placeholder="Video Title" 
                    value={newVideoTitle}
                    onChange={(e) => setNewVideoTitle(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <input 
                    type="text" 
                    placeholder="YouTube URL" 
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  <Plus size={18} /> Add Video
                </button>
              </form>
            </div>
          )}

          <div className="video-grid">
            {videos.length === 0 ? (
              <p style={{ textAlign: 'center', gridColumn: '1/-1', color: '#718096' }}>
                Training videos from Trainerize will appear here.
              </p>
            ) : (
              videos.map((v) => (
                <div key={v.id} className="video-card">
                  {isAdmin && (
                    <button className="delete-btn" onClick={() => handleDeleteVideo(v.id)}>
                      <Trash2 size={16} />
                    </button>
                  )}
                  <iframe 
                    src={v.url} 
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  />
                  <div className="video-info">
                    <h4>{v.title}</h4>
                    <p style={{ fontSize: '0.8rem', color: '#718096' }}>Trainerize Exclusive</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section id="intake">
        <div className="container">
          <h2 className="section-title">Get Started Today</h2>
          
          <div className="form-container">
            {isSubmitted ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <CheckCircle size={64} color="#48bb78" style={{ marginBottom: '1.5rem' }} />
                <h3>Thank you, Heather will contact you soon!</h3>
                <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => setIsSubmitted(false)}>
                  Submit another form
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>First Name</label>
                    <input type="text" name="firstName" required value={formData.firstName} onChange={handleFormChange} />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input type="text" name="lastName" required value={formData.lastName} onChange={handleFormChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleFormChange} />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleFormChange} />
                </div>
                <div className="form-group">
                  <label>How long have you been taking GLP1?</label>
                  <input type="text" name="glp1Duration" placeholder="e.g., 3 months, not currently taking" value={formData.glp1Duration} onChange={handleFormChange} />
                </div>
                <div className="form-group">
                  <label>What are your fitness goals?</label>
                  <textarea name="fitnessGoals" rows={4} value={formData.fitnessGoals} onChange={handleFormChange} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <Send size={18} /> Submit Application
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <div className="contact-info">
            <p><strong>Heather Cooper Training</strong></p>
            <p>Specializing in Senior Vitality & GLP-1 Support</p>
            <p>199 N. Capitol Blvd. Suite 301 Boise, ID 83702</p>
            <p>(208) 283-3707 | heather.cooper35@gmail.com</p>
          </div>
          <p style={{ opacity: 0.6, fontSize: '0.8rem', marginTop: '2rem' }}>
            © 2026 Second Mountain Ready. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
