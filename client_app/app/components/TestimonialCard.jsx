import { format } from "date-fns";
import { useState, useRef, useEffect } from "react";
import {
  ChevronUp,
  Trash2,
  Download,
  Share2,
  Code2
} from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { useSubmit } from "@remix-run/react";
import ConfirmModal from "./ConfirmModal";
import jsPDF from "jspdf";
import { IoIosLink } from "react-icons/io";
import EmbedTestimonial from "../components/EmbedTestimonial";
import ShowTestimonial from "../components/ShowTestimonial";
import ShareOnXModal from "./ShareOnXModal";
import ShareOnLinkedInModal from "./ShareOnInModal";
import Lottie from "lottie-react";
import Creating from "../../../utilities/Manufacturing (1).json"
import { FaStar } from "react-icons/fa";

export default function TestimonialCard({ testimonial, avatar, spaceId }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState(null);
  const [OpenMenuId, setOpenMenuId] = useState(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [showEmbedForm, setShowEmbedForm] = useState(false);
  const [showPublicLink, setShowPublicLink] = useState(false);
  const [loadingPublicLink, setLoadingPublicLink] = useState(false);
  const[isDownloading , setisDownloading] = useState(false);
  const [sharingPlatform, setSharingPlatform] = useState(null);
  const [loadingShareComponent, setLoadingShareComponent] = useState(false);
  const [showShareOnXModal, setShowShareOnXModal] = useState(false);
  const [showShareOnInModal , setShowShareOnInModal] = useState(false)

  const videoRef = useRef(null);
  const submit = useSubmit();
  const isVideo = Boolean(testimonial.videoURL);
  console.log(isVideo)

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  const toogleMenuId = (id) => {
    setOpenMenuId(OpenMenuId === id ? null : id);
  };

  const handleDeleteClick = (id) => {
    setTestimonialToDelete(id);
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    const form = new FormData();
    form.append("testimonialId", testimonialToDelete);
    submit(form, { method: "post", action: `/space/${spaceId}` });
    setTestimonialToDelete(null);
    setShowConfirm(false);
  };

 const handleDownload = async () => {
  setisDownloading(true);
  if (isVideo) {
    try {
      const response = await fetch(testimonial.videoURL, { mode: "cors" });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `testimonial-video-${testimonial._id}.mp4`;
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      console.error("Video download failed:", error);
    }

    
    setisDownloading(false);

  } 
  else {

    try{
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const doc = new jsPDF();
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = avatar || "/default-avatar.png";

    image.onload = () => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(150);
      doc.text("Testimonial App", 105, 20, { align: "center" });

      doc.addImage(image, "JPEG", 15, 35, 30, 30);

      let currentY = 75;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);

      doc.text("Reviewer Name:", 15, currentY);
      doc.text(`${testimonial.name}`, 60, currentY);
      currentY += 10;

      doc.text("Reviewer Email:", 15, currentY);
      doc.text(`"${testimonial.email}"`, 60, currentY);
      currentY += 10;

      doc.text("Submitted At:", 15, currentY);
      doc.text(
        testimonial.createdAt
          ? format(new Date(testimonial.createdAt), "PPP p")
          : "Unknown",
        60,
        currentY
      );
      currentY += 20;

      if (testimonial.text) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(33, 33, 33);
        doc.text("Text Testimonial", 15, currentY);
        currentY += 2;
        doc.setDrawColor(200, 200, 200);
        doc.line(15, currentY, 195, currentY);
        currentY += 10;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.setTextColor(50, 50, 50);
        const splitMessage = doc.splitTextToSize(testimonial.text, 180);
        doc.text(splitMessage, 15, currentY);
        currentY += splitMessage.length * 6;
      }

      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(120);
      doc.text("Downloaded via Testimonial App", 105, currentY + 10, {
        align: "center",
      });

      doc.save(`testimonial-${testimonial._id}.pdf`);
    }
  }

    finally{
      setisDownloading(false)
    }
  }
};


  const handlePlayClick = () => {
    setShowVideoPlayer(true);
    setTimeout(() => {
      videoRef.current?.play();
    }, 100);
  };

  
  useEffect(() => {
    if (loadingPublicLink) {
      setShowPublicLink(true);
      const timer = setTimeout(() => {
        setLoadingPublicLink(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [loadingPublicLink]);

  const handleShareX = (platform) => {
    if (platform === "X") {
      setSharingPlatform(platform);
      setLoadingShareComponent(true);
      setTimeout(() => {
        setLoadingShareComponent(false);
        setShowShareOnXModal(true);
      }, 5000);
    }
  };

  const handleShareIn = (platform) => {
    if(platform === "In"){
      setSharingPlatform(platform)
      setLoadingShareComponent(true)

      setTimeout(() => {
        setLoadingShareComponent(false)
        setShowShareOnInModal(true)
      } , 5000)
    }
  }

  return (
    <>
      <div className="relative bg-gray-900 text-white rounded-xl shadow-lg p-7 w-[900px] ml-auto mr-6 mb-10">
        <div
          className={`absolute top-4 left-4 text-[16px] font-bold px-7 py-1 rounded-2xl ${
            isVideo
              ? "bg-yellow-200 text-orange-400"
              : "bg-blue-200 text-blue-500"
          } shadow-lg`}
        >
          {isVideo ? "Video" : "Text"}
        </div>

        <div className="mt-11 mb-3 flex items-center justify-start gap-1.5 pl-1">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              size={20}
              className={`transition-transform duration-200 ${
                i < testimonial.rating ? "text-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
        </div>

        <div className="mt-14 mb-8">
          {isVideo ? (
            <div
              className={`relative rounded-md overflow-hidden border border-yellow-600 transition-all duration-300 ${
                showVideoPlayer ? "w-[720px] h-[400px]" : "w-[300px] h-[170px]"
              }`}
            >
              <video
                ref={videoRef}
                src={testimonial.videoURL}
                className="w-full h-full object-cover rounded-md cursor-pointer"
                controls={showVideoPlayer}
                onClick={!showVideoPlayer ? handlePlayClick : undefined}
              />
              {!showVideoPlayer && (
                <div
                  onClick={handlePlayClick}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30"
                >
                  <button className="bg-yellow-500 text-white p-4 rounded-full w-[70px] text-lg font-bold hover:scale-110 transition ">
                    ▶
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-200 text-[18px] leading-relaxed font-medium px-1">
              "{testimonial.text}"
            </p>
          )}
        </div>

        <div className="flex justify-between items-start">
          <div className="flex items-start gap-4">
            <img
              src={testimonial.avatar || avatar || "/default-avatar.png"}
              className="w-14 h-14 rounded-full object-cover"
            />
            <div className="space-y-1">
              <p className="text-xs text-gray-400">Name:</p>
              <p className="text-sm font-medium">{testimonial.name}</p>
              <p className="text-xs text-gray-400 mt-2">
                Submitted at:{" "}
                {testimonial.createdAt
                  ? format(new Date(testimonial.createdAt), "PPP p")
                  : "Unknown"}
              </p>
            </div>
          </div>

          <div className="text-right space-y-1 mt-1 ml-6">
            <p className="text-xs text-gray-400">Email:</p>
            <p className="text-sm text-gray-300 break-all">
              {testimonial.email}
            </p>
          </div>
        </div>

        <div className="absolute bottom-4 right-4">
          <button
            onClick={toggleExpand}
            className="text-white hover:text-gray-400 p-1"
          >
            <ChevronUp
              className={`w-5 h-5 transition-transform duration-500 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {isExpanded && (
          <div className="mt-6 flex justify-end space-x-2 pr-2 py-4 bg-gray-900 rounded-b-xl transition-all duration-700">
            <div className="relative inline-block">
              <button
                onClick={() => toogleMenuId(testimonial._id)}
                className="flex items-center gap-1 hover:bg-gray-700 text-sm px-4 py-2 rounded-md"
              >
                <Share2 className="w-4 h-4" /> Share
              </button>

              {OpenMenuId === testimonial._id && (
                <div className="absolute top-full right-0 mt-2 bg-white text-gray-900 rounded-xl shadow-lg p-3 z-10 min-w-[200px] space-y-2 w-[250px]">
                  <button
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-200 text-sm w-full text-left rounded-md"
                    onClick={() => {
                      setLoadingPublicLink(true);
                      setOpenMenuId(null);
                    }}
                  >
                    <IoIosLink className="w-5 h-5 text-gray-400" /> Get the link
                  </button>

                  <button
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-200 text-sm w-full text-left rounded-md"
                    onClick={() => {
                      setShowEmbedForm(true);
                      setOpenMenuId(null);
                    }}
                  >
                    <Code2 className="w-5 h-5 text-gray-400" /> Embed the testimonial
                  </button>

                  <button
                  onClick={() => handleShareX("X")} 
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-200 text-sm w-full text-left rounded-md">
                    <FaXTwitter className="w-5 h-5 text-blue-400" /> Share on X
                  </button>
                  <button
                  onClick={() => handleShareIn("In")} 
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-200 text-sm w-full text-left rounded-md">
                    <FaLinkedin className="w-5 h-5 text-blue-700" /> Share on LinkedIn
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => handleDeleteClick(testimonial._id)}
              className="flex items-center gap-1 hover:bg-gray-700 text-sm px-4 py-2 rounded-md"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>

            <button
  onClick={handleDownload}
  disabled={isDownloading}
  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
    isDownloading
      ? "bg-gray-600 text-gray-300 cursor-not-allowed"
      : "hover:bg-gray-700 bg-gray-800 text-white"
  }`}
>
  {isDownloading ? (
    <>
      <span className="animate-pulse">Downloading...</span>
    </>
  ) : (
    <>
      <Download className="w-4 h-4" /> Download
    </>
  )}
</button>

          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this testimonial? This action cannot be undone."
      />

      {showEmbedForm && (
        <EmbedTestimonial
          testimonial={testimonial}
          avatar={avatar}
          onClose={() => setShowEmbedForm(false)}
        />
      )}

      {showPublicLink && (

       <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center px-4">

  {loadingPublicLink ? (
    <div className="bg-white rounded-xl shadow-xl p-4 w-[300px] h-[250px] flex flex-col items-center justify-center">
      <Lottie
        animationData={Creating}
        className="w-[80px] h-[80px] text-blue-500"
        loop
        autoplay
      />
      <p className="mt-4 font-semibold text-gray-700 text-base text-center">
        Creating a page for this testimonial
      </p>
    </div>
  ) : (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
  { Boolean(testimonial?.videoURL) ? (
    
    // Directly render the small video box centered
    <ShowTestimonial testimonial={testimonial} avatar={avatar} onClose={() => setShowPublicLink(false)} />

  ) : (

  
    <div className="relative bg-white rounded-xl shadow-xl p-4 w-[90%] max-w-[800px] max-h-[90vh] overflow-y-auto">
      <button
        onClick={() => setShowPublicLink(false)}
        className="absolute top-2 right-3 text-black text-2xl font-bold"
      >
        &times;
      </button>

      <ShowTestimonial testimonial={testimonial} avatar={avatar} onClose={() => setShowPublicLink(false)} />
    </div>

  )}
</div>


  )}

 
</div>



      )}

       {loadingShareComponent && (
  <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center px-4">
    <div className="bg-white rounded-2xl shadow-2xl p-8 w-[360px] h-[280px] flex flex-col items-center justify-center space-y-6">
      <Lottie
        animationData={Creating}
        className="w-[90px] h-[90px] text-blue-500"
        loop
        autoplay
      />
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-800">
          Preparing your social share
        </p>
        <p className="mt-2 text-gray-500 text-sm">
          Generating a beautiful preview for your testimonial. This usually takes a few seconds.
        </p>
      </div>
    </div>
  </div>
)}


      {showShareOnXModal && (
  <ShareOnXModal
    testimonial={testimonial}
    onClose={() => setShowShareOnXModal(false)}
  />
)}



      {showShareOnInModal && (
  <ShareOnLinkedInModal
    testimonial={testimonial}
    onClose={() => setShowShareOnInModal(false)}
  />
)}


    </>
  );
}
