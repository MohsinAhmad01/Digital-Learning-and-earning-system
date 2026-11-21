import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import FreelanceNavbar from "../FreelanceNavbar.jsx";
import Footer from "../../../layout/Footer.jsx";
import "../../../styles/CreateGig.css";

function CreateGig() {
  const navigate = useNavigate();

  const [activePackage, setActivePackage] = useState("basic");
  const [loading, setLoading] = useState(false);
const API_URL = import.meta.env.VITE_API_URL;
  const [gigData, setGigData] = useState({
    title: "",
    category: "",
    description: "",
    tags: "",
    requirements: "",
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
const [faqs, setFaqs] = useState([
  {
    question: "",
    answer: "",
  },
]);
  const [packages, setPackages] = useState({
    basic: {
      packageName: "Basic",
      title: "Basic",
      price: "",
      deliveryTime: "",
      description: "",
      revisionNumber: 1,
      features: [],
      newFeature: "",
    },
    standard: {
      packageName: "Standard",
      title: "Standard",
      price: "",
      deliveryTime: "",
      description: "",
      revisionNumber: 2,
      features: [],
      newFeature: "",
    },
    premium: {
      packageName: "Premium",
      title: "Premium",
      price: "",
      deliveryTime: "",
      description: "",
      revisionNumber: 3,
      features: [],
      newFeature: "",
    },
  });

  const handleGigChange = (e) => {
    const { name, value } = e.target;

    setGigData({
      ...gigData,
      [name]: value,
    });
  };

  const handlePackageChange = (e) => {
    const { name, value } = e.target;

    setPackages({
      ...packages,
      [activePackage]: {
        ...packages[activePackage],
        [name]: value,
      },
    });
  };

  const handleImagesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > 5) {
      toast.error("You can upload maximum 5 images.");
      return;
    }

    setImages(selectedFiles);

    const previews = selectedFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const addFeature = () => {
    const currentPackage = packages[activePackage];

    if (!currentPackage.newFeature.trim()) {
      toast.error("Please write a feature first.");
      return;
    }

    setPackages({
      ...packages,
      [activePackage]: {
        ...currentPackage,
        features: [...currentPackage.features, currentPackage.newFeature],
        newFeature: "",
      },
    });
  };

  const removeFeature = (index) => {
    const currentPackage = packages[activePackage];

    const updatedFeatures = currentPackage.features.filter(
      (_, i) => i !== index,
    );

    setPackages({
      ...packages,
      [activePackage]: {
        ...currentPackage,
        features: updatedFeatures,
      },
    });
  };
  const handleFaqChange = (index, field, value) => {
    const updatedFaqs = [...faqs];

    updatedFaqs[index][field] = value;

    setFaqs(updatedFaqs);
  };

  const addFaq = () => {
    setFaqs([
      ...faqs,
      {
        question: "",
        answer: "",
      },
    ]);
  };

  const removeFaq = (index) => {
    const updatedFaqs = faqs.filter((_, i) => i !== index);

    setFaqs(
      updatedFaqs.length > 0 ? updatedFaqs : [{ question: "", answer: "" }],
    );
  };
  const validateForm = () => {
    if (!gigData.title.trim()) {
      toast.error("Gig title is required.");
      return false;
    }

    if (!gigData.category.trim()) {
      toast.error("Category is required.");
      return false;
    }

    if (!gigData.description.trim()) {
      toast.error("Gig description is required.");
      return false;
    }

    const packageKeys = ["basic", "standard", "premium"];

    for (let key of packageKeys) {
      const pkg = packages[key];

      if (!pkg.title || !pkg.description || !pkg.price || !pkg.deliveryTime) {
        toast.error(`${pkg.packageName} package fields are required.`);
        return false;
      }
    }

    return true;
  };

  const handleCreateGig = async (status) => {
    try {
      if (!validateForm()) return;

      setLoading(true);

      const formData = new FormData();

      formData.append("title", gigData.title);
      formData.append("category", gigData.category);
      formData.append("description", gigData.description);
      formData.append("requirements", gigData.requirements);
      formData.append("status", status);

      const tagsArray = gigData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 5);

      formData.append("tags", JSON.stringify(tagsArray));
      const cleanFaqs = faqs
        .map((faq) => ({
          question: faq.question.trim(),
          answer: faq.answer.trim(),
        }))
        .filter((faq) => faq.question && faq.answer);

      formData.append("faqs", JSON.stringify(cleanFaqs));
      images.forEach((image) => {
        formData.append("images", image);
      });

      const cleanPackage = (pkg) => ({
        packageName: pkg.packageName,
        title: pkg.title,
        description: pkg.description,
        price: Number(pkg.price),
        deliveryTime: Number(pkg.deliveryTime),
        revisionNumber: Number(pkg.revisionNumber),
        features: pkg.features,
      });

      formData.append("basic", JSON.stringify(cleanPackage(packages.basic)));
      formData.append(
        "standard",
        JSON.stringify(cleanPackage(packages.standard)),
      );
      formData.append(
        "premium",
        JSON.stringify(cleanPackage(packages.premium)),
      );

      const { data } = await axios.post(
        `${API_URL}/api/v1/gigs/create`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success(data.message || "Gig created successfully.");

      navigate("/freelancer/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create gig.");
    } finally {
      setLoading(false);
    }
  };

  const activePkg = packages[activePackage];

  return (
    <>
      <FreelanceNavbar />

      <div className="create-gig-page py-4">
        <div className="container">
          {/* HEADER */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
            <div>
              <h2 className="fw-bold mb-1">Create New Gig</h2>
              <p className="text-muted mb-0">
                Fill in the details below to create your gig.
              </p>
            </div>

            <div className="d-flex gap-3">
              {/* <button
                        className="btn btn-outline-success px-4 py-2 fw-semibold"
                        disabled={loading}
                        onClick={() => handleCreateGig("draft")}
                    >
                        Save Draft
                    </button> */}

              <button
                className="btn text-white px-4 py-2 fw-semibold"
                style={{ backgroundColor: "#005450" }}
                disabled={loading}
                onClick={() => handleCreateGig("published")}
              >
                {loading ? "Publishing..." : "Publish Gig"}
              </button>
            </div>
          </div>

          <div className="row g-4">
            {/* LEFT SIDE */}
            <div className="col-lg-7">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  {/* GIG TITLE */}
                  <div className="mb-4">
                    <label className="form-label fw-bold">Gig Title</label>

                    <div className="position-relative">
                      <input
                        type="text"
                        name="title"
                        value={gigData.title}
                        onChange={handleGigChange}
                        maxLength={80}
                        className="form-control py-3 shadow-none"
                        placeholder="I will design a modern and responsive website"
                      />

                      <span className="input-count">
                        {gigData.title.length} / 80
                      </span>
                    </div>
                  </div>

                  {/* CATEGORY */}
                  <div className="mb-4">
                    <label className="form-label fw-bold">Category</label>

                    <select
                      name="category"
                      value={gigData.category}
                      onChange={handleGigChange}
                      className="form-select py-3 shadow-none"
                    >
                      <option value="">Select a category</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Graphic Design">Graphic Design</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                      <option value="Content Writing">Content Writing</option>
                      <option value="Digital Marketing">
                        Digital Marketing
                      </option>
                      <option value="Video & Animation">
                        Video & Animation
                      </option>
                      <option value="WordPress">WordPress</option>
                      <option value="Logo Design">Logo Design</option>
                    </select>
                  </div>

                  {/* IMAGES */}
                  <div className="mb-4">
                    <label className="form-label fw-bold">Gig Images</label>

                    <label htmlFor="gigImages" className="gig-upload-box">
                      <i className="bi bi-cloud-arrow-up fs-1"></i>
                      <p className="mb-1">Drag & drop images here</p>
                      <span>or click to browse</span>

                      <input
                        id="gigImages"
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        multiple
                        hidden
                        onChange={handleImagesChange}
                      />
                    </label>

                    <small className="text-muted d-block mt-2">
                      JPG, PNG or WEBP. Max size 5MB per image.
                    </small>

                    {imagePreviews.length > 0 && (
                      <div className="d-flex flex-wrap gap-2 mt-3">
                        {imagePreviews.map((preview, index) => (
                          <img
                            key={index}
                            src={preview}
                            alt={`preview-${index}`}
                            className="gig-preview-img"
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* DESCRIPTION */}
                  <div className="mb-4">
                    <label className="form-label fw-bold">
                      Gig Description
                    </label>

                    <div className="description-editor">
                      <div className="editor-toolbar">
                        <button type="button">
                          <strong>B</strong>
                        </button>
                        <button type="button">
                          <i>I</i>
                        </button>
                        <button type="button">
                          <i className="bi bi-list-ul"></i>
                        </button>
                        <button type="button">
                          <i className="bi bi-list-ol"></i>
                        </button>
                        <button type="button">
                          <i className="bi bi-link-45deg"></i>
                        </button>
                        <button type="button">
                          <i className="bi bi-arrow-counterclockwise"></i>
                        </button>
                        <button type="button">
                          <i className="bi bi-arrow-clockwise"></i>
                        </button>
                      </div>

                      <div className="position-relative">
                        <textarea
                          name="description"
                          value={gigData.description}
                          onChange={handleGigChange}
                          maxLength={2500}
                          className="form-control shadow-none border-0"
                          placeholder="Describe your service in detail..."
                          rows={6}
                        ></textarea>

                        <span className="textarea-count">
                          {gigData.description.length} / 2500
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* TAGS */}
                  <div>
                    <label className="form-label fw-bold">
                      Tags{" "}
                      <span className="text-muted fw-normal">(up to 5)</span>
                    </label>

                    <input
                      type="text"
                      name="tags"
                      value={gigData.tags}
                      onChange={handleGigChange}
                      className="form-control py-3 shadow-none"
                      placeholder="e.g. wordpress, website, design"
                    />

                    <small className="text-muted d-block mt-2">
                      Add relevant tags to help buyers find your gig.
                    </small>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="col-lg-5">
              {/* PACKAGES */}
              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-1">Packages</h5>
                  <p className="text-muted small mb-4">
                    Add your packages and pricing
                  </p>

                  {/* PACKAGE TABS */}
                  <div className="package-tabs mb-4">
                    {["basic", "standard", "premium"].map((pkg) => (
                      <button
                        key={pkg}
                        type="button"
                        className={`package-tab-btn ${
                          activePackage === pkg ? "active" : ""
                        }`}
                        onClick={() => setActivePackage(pkg)}
                      >
                        {pkg.charAt(0).toUpperCase() + pkg.slice(1)}
                      </button>
                    ))}
                  </div>

                  {/* PACKAGE NAME */}
                  <div className="mb-3">
                    <label className="form-label fw-bold small">
                      Package Name
                    </label>

                    <input
                      type="text"
                      name="packageName"
                      value={activePkg.packageName}
                      onChange={handlePackageChange}
                      className="form-control py-3 shadow-none"
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold small">
                        Price (USD)
                      </label>

                      <input
                        type="number"
                        name="price"
                        value={activePkg.price}
                        onChange={handlePackageChange}
                        className="form-control py-3 shadow-none"
                        placeholder="50"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold small">
                        Delivery Time
                      </label>

                      <select
                        name="deliveryTime"
                        value={activePkg.deliveryTime}
                        onChange={handlePackageChange}
                        className="form-select py-3 shadow-none"
                      >
                        <option value="">Select</option>
                        <option value="1">1 Day</option>
                        <option value="2">2 Days</option>
                        <option value="3">3 Days</option>
                        <option value="5">5 Days</option>
                        <option value="7">7 Days</option>
                        <option value="10">10 Days</option>
                        <option value="14">14 Days</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold small">
                      Revisions
                    </label>

                    <input
                      type="number"
                      name="revisionNumber"
                      value={activePkg.revisionNumber}
                      onChange={handlePackageChange}
                      className="form-control py-3 shadow-none"
                      placeholder="2"
                    />
                  </div>

                  {/* PACKAGE DESCRIPTION */}
                  <div className="mb-3">
                    <label className="form-label fw-bold small">
                      Description
                    </label>

                    <div className="position-relative">
                      <textarea
                        name="description"
                        value={activePkg.description}
                        onChange={handlePackageChange}
                        maxLength={200}
                        rows={4}
                        className="form-control shadow-none"
                        placeholder="A simple and responsive website up to 5 pages."
                      ></textarea>

                      <span className="package-desc-count">
                        {activePkg.description.length} / 200
                      </span>
                    </div>
                  </div>

                  {/* FEATURE INPUT */}
                  <div className="d-flex gap-2 mb-3">
                    <input
                      type="text"
                      name="newFeature"
                      value={activePkg.newFeature}
                      onChange={handlePackageChange}
                      className="form-control shadow-none"
                      placeholder="Add package feature"
                    />

                    <button
                      type="button"
                      className="btn btn-outline-success fw-semibold"
                      onClick={addFeature}
                    >
                      <i className="bi bi-plus-lg me-1"></i>
                      Add
                    </button>
                  </div>

                  {/* FEATURES */}
                  <div className="d-flex flex-wrap gap-2">
                    {activePkg.features.map((feature, index) => (
                      <span
                        key={index}
                        className="bg-light text-dark border px-3 py-2 d-flex align-items-center gap-2"
                      >
                        {feature}
                        <button
                          type="button"
                          className="btn-close package-feature-close"
                          onClick={() => removeFeature(index)}
                        ></button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="card-footer bg-white text-center py-3">
                  <button
                    type="button"
                    className="btn text-success fw-bold"
                    disabled
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Add Another Package
                  </button>
                </div>
              </div>

              {/* REQUIREMENTS */}
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-1">
                    Requirements{" "}
                    <span className="text-muted fw-normal">(Optional)</span>
                  </h6>

                  <p className="text-muted small mb-3">
                    Add any requirements for the buyer
                  </p>

                  <textarea
                    name="requirements"
                    value={gigData.requirements}
                    onChange={handleGigChange}
                    rows={5}
                    className="form-control shadow-none"
                    placeholder="e.g. Please provide logo, content, and color preferences..."
                  ></textarea>
                </div>
              </div>
              {/* FREQUENTLY ASKED QUESTIONS */}
              <div className="card border-0 shadow-sm rounded-4 mt-4">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <h6 className="fw-bold mb-1">
                        Frequently Asked Questions
                      </h6>
                      <p className="text-muted small mb-0">
                        Add common questions buyers may ask.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-success fw-semibold"
                      onClick={addFaq}
                    >
                      <i className="bi bi-plus-circle me-1"></i>
                      Add
                    </button>
                  </div>

                  <div className="d-flex flex-column gap-3">
                    {faqs.map((faq, index) => (
                      <div className="faq-create-box" key={index}>
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <label className="form-label fw-bold small mb-0">
                            FAQ {index + 1}
                          </label>

                          {faqs.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-sm text-danger p-0"
                              onClick={() => removeFaq(index)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          )}
                        </div>

                        <input
                          type="text"
                          className="form-control shadow-none mb-2"
                          placeholder="e.g. Will my website be mobile friendly?"
                          value={faq.question}
                          onChange={(e) =>
                            handleFaqChange(index, "question", e.target.value)
                          }
                        />

                        <textarea
                          rows={3}
                          className="form-control shadow-none"
                          placeholder="Write the answer here..."
                          value={faq.answer}
                          onChange={(e) =>
                            handleFaqChange(index, "answer", e.target.value)
                          }
                        ></textarea>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default CreateGig;
