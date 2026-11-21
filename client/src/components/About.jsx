import "../styles/About.css";
import React from "react";
import Navbar from "./Navbar.jsx";
import Footer from "../layout/Footer.jsx";
import Bashir from "../assets/bashir.jpeg";
import Mohsin from "../assets/mohsin.jpeg";
import abdullah from "../assets/seller1.png";
import {
  FaUsers,
  FaChalkboardTeacher,
  FaHandshake,
  FaBriefcase,
  FaCheckCircle,
} from "react-icons/fa";
import {
  FaShieldAlt,
  FaLightbulb,
  FaAward,
  FaGlobe,
  FaChartLine,
} from "react-icons/fa";
function About() {
  return (
    <>
      <Navbar />
      <section className="about-hero-section py-5">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-7 text-white">
              <p className="about-label mb-2">ABOUT US</p>

              <h1 className="fw-bold about-title mb-3">
                Empowering learners, creators, and professionals to learn, work,
                and grow together.
              </h1>

              <div className="about-line mb-3"></div>

              <p className="about-hero-text mb-0">
                DevTech is a unified platform that combines online learning,
                professional services, and career opportunities in one place.
                Our mission is to make quality education and professional growth
                accessible to everyone.
              </p>
            </div>

            <div className="col-lg-5">
              <div className="row g-3">
                <div className="col-6">
                  <img
                    src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7"
                    alt="Professional team"
                    className="img-fluid about-hero-img w-100"
                  />
                </div>

                <div className="col-6">
                  <img
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a"
                    alt="Business professional"
                    className="img-fluid about-hero-img w-100"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <h3 className="fw-bold mb-4">
                <span className="about-heading-line"></span>
                Who We Are
              </h3>
              <p className="about-text">
                DevTech is more than just a platform — it’s a movement to bridge
                the gap between learning, skill development, and real-world
                opportunities.
              </p>

              <p className="about-text">
                We provide learners with the best online courses, professionals
                with a trusted marketplace to offer their services, and
                companies with access to top talent.
              </p>

              <p className="about-text">
                By combining education, services, and career opportunities in
                one seamless ecosystem, we aim to help individuals and
                businesses achieve their goals faster and smarter.
              </p>

              <div className="row g-3 mt-4">
                <div className="col-6 col-md-3">
                  <div className="about-stat">
                    <FaUsers style={{fontSize:'40px'}}/>
                    <h5>10k+</h5>
                    <small>Active Learners</small>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="about-stat">
                    <FaChalkboardTeacher style={{fontSize:'40px'}} />
                    <h5>500+</h5>
                    <small>Expert Instructors</small>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="about-stat">
                    <FaHandshake style={{fontSize:'40px'}}/>
                    <h5>2k+</h5>
                    <small>Services Listed</small>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="about-stat">
                    <FaBriefcase style={{fontSize:'40px'}} />
                    <h5>1k+</h5>
                    <small>Jobs Posted</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="position-relative about-image-box">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978"
                  alt="Team discussion"
                  className="img-fluid rounded-3 w-100 about-main-img"
                />

                <span className="about-dark-dot"></span>

                <div className="about-trust-card d-flex align-items-center gap-3">
                  <FaCheckCircle className="about-check" />
                  <div>
                    <strong>
                      Trusted by thousands of learners and professionals
                    </strong>
                    <small>
                      To build skills, grow careers, and achieve success.
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-5 bg-light">
        <div className="container">
          {/* Mission & Vision */}
          <div className="row g-5">
            {/* Mission */}
            <div className="col-lg-6">
              <h3 className="section-heading mb-3">
                <span></span> Our Mission
              </h3>

              <p className="text-muted mb-4">
                Our mission is to empower individuals with the skills,
                knowledge, and opportunities needed to succeed in the digital
                economy.
              </p>

              <div className="mission-item">
                <FaBriefcase style={{fontSize:'30px'}}/>
                <div>
                  <h6>Quality Education</h6>
                  <p>
                    We provide high-quality courses created by industry experts
                    to help learners build in-demand skills.
                  </p>
                </div>
              </div>

              <div className="mission-item">
                <FaShieldAlt style={{fontSize:'30px'}}/>
                <div>
                  <h6>Trusted Services</h6>
                  <p>
                    We connect you with verified professionals for your projects
                    and business needs.
                  </p>
                </div>
              </div>

              <div className="mission-item">
                <FaChartLine style={{fontSize:'30px'}} />
                <div>
                  <h6>Career Growth</h6>
                  <p>
                    We help you find the right opportunities to advance your
                    career and achieve your goals.
                  </p>
                </div>
              </div>
            </div>

            {/* Vision */}
            <div className="col-lg-6 vision-border">
              <h3 className="section-heading mb-3">
                <span></span> Our Vision
              </h3>

              <p className="text-muted mb-4">
                To become the world's most trusted platform for lifelong
                learning, professional services, and career development.
              </p>

              <div className="mission-item">
                <FaLightbulb  style={{fontSize:'30px'}}/>
                <div>
                  <h6>Innovation</h6>
                  <p>
                    We leverage technology and AI to enhance your learning and
                    working experiences.
                  </p>
                </div>
              </div>

              <div className="mission-item">
                <FaUsers  style={{fontSize:'30px'}}/>
                <div>
                  <h6>Community</h6>
                  <p>
                    We build a supportive community of learners, professionals,
                    and innovators.
                  </p>
                </div>
              </div>

              <div className="mission-item">
                <FaGlobe style={{fontSize:'30px'}}/>
                <div>
                  <h6>Global Impact</h6>
                  <p>
                    We aim to make quality education and professional
                    opportunities accessible worldwide.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div className="text-center mt-5 pt-4">
            <h3 className="section-heading-center">
              <span></span> Our Core Values
            </h3>

            <div className="row g-4 mt-3">
              <div className="col-lg col-md-4 col-6">
                <div className="value-card">
                  <FaShieldAlt style={{fontSize:'35px'}} />
                  <h6>Integrity</h6>
                  <p>
                    We operate with honesty, transparency, and accountability.
                  </p>
                </div>
              </div>

              <div className="col-lg col-md-4 col-6">
                <div className="value-card">
                  <FaLightbulb style={{fontSize:'35px'}} />
                  <h6>Innovation</h6>
                  <p>We embrace new ideas and technologies.</p>
                </div>
              </div>

              <div className="col-lg col-md-4 col-6">
                <div className="value-card">
                  <FaUsers  style={{fontSize:'35px'}} />
                  <h6>User-Centric</h6>
                  <p>Our users are at the heart of everything we do.</p>
                </div>
              </div>

              <div className="col-lg col-md-4 col-6">
                <div className="value-card">
                  <FaAward  style={{fontSize:'35px'}}/>
                  <h6>Excellence</h6>
                  <p>
                    We are committed to delivering high-quality experiences.
                  </p>
                </div>
              </div>

              <div className="col-lg col-md-4 col-6">
                <div className="value-card">
                  <FaGlobe  style={{fontSize:'35px'}}/>
                  <h6>Inclusivity</h6>
                  <p>
                    We believe opportunities should be accessible to everyone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="team-section py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold team-heading">
              <span></span> Meet Our Team
            </h2>
            <p className="team-subtitle mx-auto mt-3">
              We are a passionate group of developers, designers, and innovators
              working together to build a platform that creates real impact.
            </p>
          </div>

          <div className="row g-4">
            {/* Member 1 */}
            <div className="col-lg-3 col-md-4 col-sm-6 ">
              <div className="team-card rounded-4">
                <img src={Mohsin} alt="Mohsin Ahmad" />
                <h5>Mohsin Ahmad</h5>
                <p>Founder</p>
              </div>
            </div>

            {/* Member 2 */}
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="team-card rounded-4">
                <img
                  src={abdullah}
                  alt="Abdullah"
                />
                <h5>Abdullah</h5>
                <p>Co-Founder</p>
              </div>
            </div>

            {/* Member 3 */}
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="team-card rounded-4">
                <img
                  src={Bashir}
                  alt="Bashir Ullah"
                />
                <h5>Bashir Ullah</h5>
                <p>Chief Executive Officer</p>
              </div>
            </div>

            {/* Member 4 */}
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="team-card rounded-4">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
                  alt="Manahil Huzaifa"
                />
                <h5>Manahil Huzaifa</h5>
                <p>Chief Technology Officer</p>
              </div>
            </div>

            {/* Member 5 */}
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="team-card rounded-4">
                <img
                  src="https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f"
                  alt="Yaseen Khan"
                />
                <h5>Yaseen Khan</h5>
                <p>Lead Programmer</p>
              </div>
            </div>

            {/* Member 6 */}
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="team-card rounded-4">
                <img
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1"
                  alt="Laiba Ali"
                />
                <h5>Laiba Ali</h5>
                <p>Digital Marketer</p>
              </div>
            </div>

            {/* Member 7 */}
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="team-card rounded-4">
                <img
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7"
                  alt="Ahmed Khogyani"
                />
                <h5>Ahmed Khogyani</h5>
                <p>UX Designer</p>
              </div>
            </div>

            {/* Join Team Card */}
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="join-team bg-body-tertiary">
              <div className="join-team-card">
                <h5>Interested to join our team ?</h5>
                <a href="/contact">
                  Apply now <span>→</span>
                </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default About;
