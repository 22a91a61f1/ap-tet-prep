import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Tv, Play, Users, Clock, Flame, Youtube, HelpCircle, Loader2, RotateCw, Calendar } from "lucide-react";
import manualVideos from "../resources/manualVideos.json";

interface VideoInfo {
  title: string;
  teacher: string;
  duration: string;
  youtubeId: string;
  views?: string;
  publishedAt?: string;
}

// Helper to extract 11 character YouTube ID from URL
const getYoutubeId = (url: string) => {
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  return match ? match[1] : "";
};

// Helper validation to confirm videoId exists, YouTube URL is valid, and Video title exists
const isValidVideoInfo = (v: any): v is VideoInfo => {
  if (!v) return false;

  const hasVideoId = typeof v.youtubeId === "string" && v.youtubeId.trim().length === 11;
  if (!hasVideoId) return false;

  const hasTitle = typeof v.title === "string" && v.title.trim().length > 0;
  if (!hasTitle) return false;

  const watchUrl = `https://www.youtube.com/watch?v=${v.youtubeId.trim()}`;
  const isValidUrl = watchUrl.startsWith("https://www.youtube.com/watch?v=") && watchUrl.length === 43;
  if (!isValidUrl) return false;

  return true;
};

const formatPublishedDate = (dateStr?: string) => {
  if (!dateStr) return "ఆన్‌లైన్ క్లాస్";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "ఆన్‌లైన్ క్లాస్";
    return d.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (e) {
    return "ఆన్‌లైన్ క్లాస్";
  }
};

const getManualVideosForSubtopic = (
  subtopicName: string,
  topicId: string,
  subject: string,
  paper: string
): VideoInfo[] | null => {
  const normSub = subtopicName.toLowerCase();
  
  // Reading Comprehension (Paper I Telugu tel_p1_t1)
  if (topicId === "tel_p1_t1" && paper.includes("Paper I") && subject === "Telugu") {
    const manualList = (manualVideos as any)?.paper1?.telugu?.["reading-comprehension"] || [];
    return manualList.map((v: any) => ({
      title: v.title,
      teacher: v.teacher,
      duration: "N/A",
      youtubeId: getYoutubeId(v.youtubeUrl),
      views: undefined,
      publishedAt: undefined
    }));
  }

  // Algebra & Real Numbers (Paper II Mathematics math_p2_t1)
  if (topicId === "math_p2_t1" && paper.includes("Paper II") && subject === "Mathematics") {
    if (normSub.includes("బీజగణిత") || normSub.includes("algebra")) {
      const manualList = (manualVideos as any)?.paper2?.mathematics?.["algebra"] || [];
      return manualList.map((v: any) => ({
        title: v.title,
        teacher: v.teacher,
        duration: "N/A",
        youtubeId: getYoutubeId(v.youtubeUrl),
        views: undefined,
        publishedAt: undefined
      }));
    }
    if (normSub.includes("కరణీయ") || normSub.includes("real-numbers") || normSub.includes("real numbers") || normSub.includes("irrationals") || normSub.includes("సమితులు")) {
      const manualList = (manualVideos as any)?.paper2?.mathematics?.["real-numbers"] || [];
      return manualList.map((v: any) => ({
        title: v.title,
        teacher: v.teacher,
        duration: "N/A",
        youtubeId: getYoutubeId(v.youtubeUrl),
        views: undefined,
        publishedAt: undefined
      }));
    }
  }

  return null;
};

// Subtopic videos rendering component
const SubtopicVideoSection: React.FC<{
  subtopicName: string;
  index: number;
  selectedPaper: string;
  selectedSubject: string;
  selectedTopicId: string;
}> = ({ subtopicName, index, selectedPaper, selectedSubject, selectedTopicId }) => {
  const [videos, setVideos] = useState<VideoInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQueryUsed, setSearchQueryUsed] = useState<string>("");

  const cacheKey = `yt_video_cache_subtopic_${selectedTopicId}_${encodeURIComponent(subtopicName)}`;

  const loadVideos = async (forceRetry = false) => {
    setLoading(true);
    setError(null);

    // 1. Check for manual override videos first
    const manualList = getManualVideosForSubtopic(subtopicName, selectedTopicId, selectedSubject, selectedPaper);
    if (manualList && manualList.length > 0) {
      setVideos(manualList);
      setSearchQueryUsed("Manual curated resources");
      setLoading(false);
      return;
    }

    // 2. Check cache
    if (!forceRetry) {
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          const age = Date.now() - timestamp;
          if (age < 2592000000 && data) { // 30 days
            setVideos(data.videos || []);
            setSearchQueryUsed(data.searchQuery || "");
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.error("Failed to parse cache for subtopic:", subtopicName, e);
      }
    }

    // 3. Fetch from API
    try {
      const url = `/api/youtube/search?paperType=${encodeURIComponent(selectedPaper)}&subject=${encodeURIComponent(selectedSubject)}&topic=${encodeURIComponent(subtopicName)}&topicId=${encodeURIComponent(selectedTopicId)}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }
      const data = await res.json();
      
      const compiled: VideoInfo[] = [];
      if (data.primaryVideo && isValidVideoInfo(data.primaryVideo)) {
        compiled.push(data.primaryVideo);
      }
      if (data.additionalVideos) {
        data.additionalVideos.forEach((v: any) => {
          if (isValidVideoInfo(v) && compiled.length < 3) {
            compiled.push(v);
          }
        });
      }

      setVideos(compiled);
      setSearchQueryUsed(data.searchQuery || "");

      // Store in cache
      try {
        localStorage.setItem(cacheKey, JSON.stringify({
          data: { videos: compiled, searchQuery: data.searchQuery },
          timestamp: Date.now()
        }));
      } catch (e) {
        console.error("Failed to write cache for subtopic:", subtopicName, e);
      }
    } catch (err: any) {
      console.error("Error fetching videos for subtopic", subtopicName, err);
      setError("No Telugu YouTube video is currently available for this subtopic.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos(false);
  }, [subtopicName, selectedTopicId, selectedPaper, selectedSubject]);

  const fallbackSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(`AP TET ${selectedSubject} ${subtopicName} Telugu`)}`;

  return (
    <div className="bg-slate-50/50 rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-4 shadow-sm" id={`subtopic_video_section_${index}`}>
      {/* Subtopic Header */}
      <div className="flex items-start sm:items-center space-x-2.5">
        <div className="bg-rose-50 text-rose-600 p-2 rounded-xl border border-rose-100 shrink-0">
          <Play className="w-4 h-4 fill-current" />
        </div>
        <div>
          <h4 className="text-sm font-black text-slate-800 tracking-tight">
            ఉప అంశం {index + 1}: {subtopicName}
          </h4>
          <p className="text-[10px] sm:text-xs text-slate-500 font-semibold">
            ఈ సబ్-టాపిక్ కోసం నిపుణుల ప్రత్యేక వివరణ
          </p>
        </div>
      </div>

      {/* Videos Area */}
      {loading ? (
        <div className="flex items-center justify-center py-6 space-x-2 text-slate-500 text-xs font-bold">
          <Loader2 className="w-4 h-4 text-rose-500 animate-spin" />
          <span>వీడియోలను శోధిస్తోంది...</span>
        </div>
      ) : error || videos.length === 0 ? (
        <div className="bg-white rounded-xl border border-rose-100 p-4 text-center space-y-3" id={`subtopic_error_${index}`}>
          <p className="text-xs sm:text-sm font-semibold text-rose-600">
            No Telugu YouTube video is currently available for this subtopic.
          </p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={() => loadVideos(true)}
              className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg border border-slate-200 transition-all cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>రిఫ్రెష్ (Retry)</span>
            </button>
            <a
              href={fallbackSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <Youtube className="w-3.5 h-3.5" />
              <span>యూట్యూబ్‌లో వెతకండి</span>
            </a>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id={`subtopic_videos_grid_${index}`}>
          {videos.map((video) => {
            const thumbnailUrl = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
            const watchUrl = `https://www.youtube.com/watch?v=${video.youtubeId}`;

            return (
              <div
                key={video.youtubeId}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all duration-150"
                id={`video_card_${video.youtubeId}`}
              >
                <div>
                  {/* Thumbnail */}
                  <div className="aspect-video w-full relative group overflow-hidden bg-slate-100">
                    <img
                      src={thumbnailUrl}
                      alt={video.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
                    />
                    <span className="absolute bottom-2 right-2 bg-slate-900/80 text-white font-mono text-[9px] font-semibold px-1.5 py-0.5 rounded shadow">
                      {video.duration}
                    </span>
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-rose-600 text-white p-2 rounded-full shadow-md">
                        <Play className="w-4 h-4 fill-current" />
                      </div>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-3 space-y-2">
                    <h5 className="font-extrabold text-slate-800 text-xs leading-snug line-clamp-2 min-h-[2rem]">
                      {video.title}
                    </h5>
                    <div className="space-y-1 text-[11px] text-slate-500 font-medium">
                      <div className="flex items-center text-slate-700 font-bold">
                        <Users className="w-3 h-3 mr-1 text-slate-400 shrink-0" />
                        <span className="truncate">బోధకుడు: {video.teacher}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1 text-slate-400 shrink-0" />
                        <span>వ్యవధి: {video.duration}</span>
                      </div>
                      {video.views && (
                        <div className="flex items-center">
                          <Users className="w-3 h-3 mr-1 text-slate-400 shrink-0" />
                          <span>వీక్షణలు: {video.views}</span>
                        </div>
                      )}
                      {video.publishedAt && (
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1 text-slate-400 shrink-0" />
                          <span>ప్రచురణ: {formatPublishedDate(video.publishedAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Watch Button */}
                <div className="p-3 pt-0">
                  <a
                    href={watchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center space-x-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-all shadow-sm cursor-pointer"
                    id={`watch_btn_${video.youtubeId}`}
                  >
                    <Youtube className="w-3.5 h-3.5 fill-current" />
                    <span>యూట్యూబ్లో చూడండి</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const VideoCard: React.FC = () => {
  const { selectedTopicId, selectedPaper, selectedSubject, getCurrentTopicData } = useApp();
  const currentTopic = getCurrentTopicData();

  if (!currentTopic) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
        <p className="font-semibold text-lg">దయచేసి ఒక అంశాన్ని (Topic) ఎంచుకోండి.</p>
      </div>
    );
  }

  const subtopics = currentTopic.subtopics || [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 sm:p-6 space-y-6" id={`video_component_${selectedTopicId}`}>
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 select-none">
        <div className="flex items-center space-x-2">
          <div className="bg-rose-50 text-rose-600 p-2 rounded-xl border border-rose-100">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-800">
              తెలుగు వీడియో క్లాసులు (Telugu Video Lectures)
            </h3>
            <p className="text-xs text-slate-500">AP TET నిపుణులతో సుదీర్ఘ వివరణాత్మక బోధనా తరగతులు</p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center space-x-1 px-3 py-1 bg-red-50 text-red-700 border border-red-100 text-[10px] font-bold tracking-wider rounded-full uppercase">
          <Flame className="w-3.5 h-3.5 mr-0.5 fill-current animate-pulse" />
          Telugu Medium
        </span>
      </div>

      {/* Subtopic Video Blocks */}
      <div className="space-y-6" id="subtopics_video_stack">
        {subtopics.map((subtopic, index) => (
          <SubtopicVideoSection
            key={`${selectedTopicId}_sub_${index}`}
            subtopicName={subtopic}
            index={index}
            selectedPaper={selectedPaper}
            selectedSubject={selectedSubject}
            selectedTopicId={selectedTopicId}
          />
        ))}
      </div>

      {/* Educational disclaimer */}
      <div className="p-4 rounded-xl bg-blue-50/30 border border-blue-100/40 text-xs text-blue-900 flex items-start space-x-2.5 select-none font-semibold">
        <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>గమనిక (Disclaimer):</strong> Video recommendations are educational resources programmatically verified for AP TET preparation and may change dynamically over time. అన్ని క్లాసులు తెలుగులోనే విశ్లేషించబడినవి.
        </p>
      </div>
    </div>
  );
};
