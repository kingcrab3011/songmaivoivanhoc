import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Volume1,
  Shuffle,
  Repeat,
  Repeat1,
  ListMusic,
  X,
  Music,
  Upload,
  Link as LinkIcon,
  Sparkles,
  Disc3,
  Sliders,
  Check,
  Settings,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Download,
  AlertCircle,
  KeyRound,
  Youtube,
  Radio,
  Plus,
} from 'lucide-react';
import {
  MusicTrack,
  MusicCategory,
  MUSIC_CATEGORIES,
} from '../data/musicTracks';
import { JamendoService } from '../services/jamendoService';
import { parseMediaLink, ParsedMediaResult } from '../utils/musicParser';

interface MusicPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrack: MusicTrack;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  currentTime: number;
  duration: number;
  onSeek: (seconds: number) => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isShuffle: boolean;
  onToggleShuffle: () => void;
  repeatMode: 'off' | 'all' | 'one';
  onToggleRepeat: () => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  playlist: MusicTrack[];
  onSelectTrack: (track: MusicTrack) => void;
  onAddCustomTrack: (track: MusicTrack) => void;
  onRefreshJamendo?: () => void;
  isLoadingApi?: boolean;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  isOpen,
  onClose,
  currentTrack,
  isPlaying,
  onTogglePlay,
  onNextTrack,
  onPrevTrack,
  currentTime,
  duration,
  onSeek,
  volume,
  onVolumeChange,
  isMuted,
  onToggleMute,
  isShuffle,
  onToggleShuffle,
  repeatMode,
  onToggleRepeat,
  selectedCategory,
  onSelectCategory,
  playlist,
  onSelectTrack,
  onAddCustomTrack,
  onRefreshJamendo,
  isLoadingApi = false,
}) => {
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Add media link states (YouTube, Spotify, MP3)
  const [mediaInputUrl, setMediaInputUrl] = useState('');
  const [customTitleInput, setCustomTitleInput] = useState('');
  const [customArtistInput, setCustomArtistInput] = useState('');
  const [selectedCategoryForAdd, setSelectedCategoryForAdd] = useState<MusicCategory>('tap-trung');
  const [previewParsed, setPreviewParsed] = useState<ParsedMediaResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Jamendo Client ID Configuration states
  const [inputClientId, setInputClientId] = useState('');
  const [testResult, setTestResult] = useState<{
    tested: boolean;
    success: boolean;
    message: string;
  } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [savedClientId, setSavedClientId] = useState('');

  useEffect(() => {
    const id = JamendoService.getClientId();
    setSavedClientId(id);
    setInputClientId(id);
  }, [showSettingsModal]);

  // Real-time URL parse preview in Add Modal
  useEffect(() => {
    if (!mediaInputUrl.trim()) {
      setPreviewParsed(null);
      return;
    }
    const result = parseMediaLink(mediaInputUrl, customTitleInput, customArtistInput, selectedCategoryForAdd);
    setPreviewParsed(result);
  }, [mediaInputUrl, customTitleInput, customArtistInput, selectedCategoryForAdd]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const blobUrl = URL.createObjectURL(file);
    const catInfo = MUSIC_CATEGORIES.find((c) => c.id === selectedCategoryForAdd) || MUSIC_CATEGORIES[0];
    const newTrack: MusicTrack = {
      id: `custom-${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, ''),
      artist: 'Tệp thiết bị cá nhân',
      category: selectedCategoryForAdd,
      categoryLabel: catInfo.name,
      src: blobUrl,
      platform: 'local',
      description: 'Nhạc tải lên từ thiết bị cá nhân',
      audiodownload_allowed: true,
      license: 'Tệp nội bộ',
    };
    onAddCustomTrack(newTrack);
    onSelectTrack(newTrack);
    setShowCustomModal(false);
    setMediaInputUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddParsedMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewParsed || !previewParsed.track) return;
    onAddCustomTrack(previewParsed.track);
    onSelectTrack(previewParsed.track);
    setMediaInputUrl('');
    setCustomTitleInput('');
    setCustomArtistInput('');
    setPreviewParsed(null);
    setShowCustomModal(false);
  };

  const handleTestJamendo = async () => {
    if (!inputClientId.trim()) {
      setTestResult({
        tested: true,
        success: false,
        message: 'Vui lòng nhập Client ID của bạn trước khi kiểm tra.',
      });
      return;
    }
    setIsTesting(true);
    setTestResult(null);
    try {
      const result = await JamendoService.testConnection(inputClientId.trim());
      setTestResult({
        tested: true,
        success: result.success,
        message: result.message,
      });
    } catch {
      setTestResult({
        tested: true,
        success: false,
        message: 'Không thể kết nối đến máy chủ Jamendo API.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveJamendo = () => {
    JamendoService.setClientId(inputClientId.trim());
    setSavedClientId(inputClientId.trim());
    setShowSettingsModal(false);
    if (onRefreshJamendo) onRefreshJamendo();
  };

  const handleRemoveJamendo = () => {
    JamendoService.removeClientId();
    setInputClientId('');
    setSavedClientId('');
    setTestResult(null);
    setShowSettingsModal(false);
    if (onRefreshJamendo) onRefreshJamendo();
  };

  const isYoutubeTrack = currentTrack.platform === 'youtube';
  const isSpotifyTrack = currentTrack.platform === 'spotify';

  return (
    <>
      {/* Floating Modern Music Player Panel - Apple Inspired with Champagne Gold & Bronze Dark Glow */}
      <div
        className="fixed z-50 bottom-5 left-4 md:left-[76px] w-[calc(100vw-32px)] sm:w-[420px] md:w-[440px] bg-[#FAF6EE]/95 dark:bg-[#1C1C1E]/95 backdrop-blur-2xl border border-[#D9C9AE] dark:border-[#3D352D] rounded-3xl shadow-2xl p-5 text-[#29241F] dark:text-[#F5F5F5] animate-apple-in transition-all duration-300"
        role="dialog"
        aria-label="Trình phát nhạc học tập"
      >
        {/* Header with Title, Disc animation & Quick Buttons */}
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#D9C9AE]/40 dark:border-[#3D352D]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#7A263A]/10 dark:bg-[#D2516B]/20 text-[#7A263A] dark:text-[#D2516B] flex items-center justify-center shrink-0">
              <Disc3
                className={`w-4 h-4 ${isPlaying && !isSpotifyTrack ? 'animate-spin' : ''}`}
                style={{ animationDuration: '4s' }}
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#7A263A] dark:text-[#D2516B] truncate">
                  Văn Học & Âm Nhạc Lab
                </span>
                {isYoutubeTrack ? (
                  <span className="text-[9.5px] px-1.5 py-0.2 bg-red-500/15 text-red-600 dark:text-red-400 rounded-full font-medium border border-red-500/20 whitespace-nowrap">
                    YouTube
                  </span>
                ) : isSpotifyTrack ? (
                  <span className="text-[9.5px] px-1.5 py-0.2 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-full font-medium border border-emerald-500/20 whitespace-nowrap">
                    Spotify
                  </span>
                ) : savedClientId ? (
                  <span className="text-[9.5px] px-1.5 py-0.2 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-full font-medium border border-emerald-500/20 whitespace-nowrap">
                    Jamendo Live
                  </span>
                ) : (
                  <span className="text-[9.5px] px-1.5 py-0.2 bg-[#7A263A]/10 dark:bg-[#D2516B]/15 text-[#7A263A] dark:text-[#D2516B] rounded-full font-medium border border-[#7A263A]/20 dark:border-[#D2516B]/20 whitespace-nowrap">
                    50 Bài Chuẩn
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#847768] dark:text-[#B0B0B0] font-normal leading-tight truncate">
                Tập trung sâu & Khơi nguồn cảm hứng viết văn
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Jamendo API Settings Button */}
            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-1.5 rounded-lg border text-xs font-medium transition-all hover:scale-105 active:scale-95 cursor-pointer bg-[#FAF6EE] dark:bg-[#25201C] border-[#D9C9AE] dark:border-[#3D352D] text-[#29241F] dark:text-[#F5F5F5] hover:bg-white dark:hover:bg-[#2E2E2E] apple-glow-btn"
              title="Cài đặt Jamendo API Key"
              aria-label="Cài đặt Jamendo API"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>

            {/* Playlist Drawer Toggle */}
            <button
              onClick={() => setShowPlaylist(!showPlaylist)}
              className={`p-1.5 rounded-lg border text-xs font-medium transition-all hover:scale-105 active:scale-95 cursor-pointer apple-glow-btn ${
                showPlaylist
                  ? 'bg-[#7A263A] text-white border-[#7A263A] dark:bg-[#D2516B] dark:border-[#D2516B]'
                  : 'bg-[#FAF6EE] dark:bg-[#25201C] border-[#D9C9AE] dark:border-[#3D352D] text-[#29241F] dark:text-[#F5F5F5] hover:bg-white dark:hover:bg-[#2E2E2E]'
              }`}
              title="Danh sách bài hát"
              aria-label="Mở danh sách bài hát"
            >
              <ListMusic className="w-3.5 h-3.5" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#EFE4D0] dark:hover:bg-[#2A2A2A] text-[#847768] dark:text-[#B0B0B0] hover:text-[#29241F] dark:hover:text-[#F5F5F5] transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title="Thu nhỏ trình phát"
              aria-label="Đóng trình phát nhạc"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Switcher Tabs (Unified Library: Tất cả, YouTube, Spotify + 5 genres) */}
        <div className="pt-3 pb-2">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
            <button
              onClick={() => onSelectCategory('all')}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap font-medium text-[11.5px] transition-all cursor-pointer select-none apple-glow-pill ${
                selectedCategory === 'all'
                  ? 'bg-[#7A263A] dark:bg-[#D2516B] text-white shadow-xs'
                  : 'bg-[#EFE4D0]/80 dark:bg-[#282828] text-[#554C42] dark:text-[#B0B0B0] hover:bg-[#E2D4BC] dark:hover:bg-[#333333]'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => onSelectCategory('youtube')}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap font-medium text-[11.5px] transition-all cursor-pointer select-none inline-flex items-center gap-1 apple-glow-pill ${
                selectedCategory === 'youtube'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-red-500/10 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-500/20'
              }`}
            >
              <Youtube className="w-3 h-3" />
              YouTube
            </button>
            <button
              onClick={() => onSelectCategory('spotify')}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap font-medium text-[11.5px] transition-all cursor-pointer select-none inline-flex items-center gap-1 apple-glow-pill ${
                selectedCategory === 'spotify'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-500/10 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
              }`}
            >
              <Radio className="w-3 h-3" />
              Spotify
            </button>
            {MUSIC_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-full whitespace-nowrap font-medium text-[11.5px] transition-all cursor-pointer select-none apple-glow-pill ${
                    isActive
                      ? 'bg-[#7A263A] dark:bg-[#D2516B] text-white shadow-xs'
                      : 'bg-[#EFE4D0]/80 dark:bg-[#282828] text-[#554C42] dark:text-[#B0B0B0] hover:bg-[#E2D4BC] dark:hover:bg-[#333333]'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Embedded Player Section: YouTube iframe, Spotify Embed, or Standard Audio Card */}
        {isYoutubeTrack ? (
          <div className="my-2 rounded-2xl overflow-hidden bg-black aspect-video relative shadow-md border border-[#D9C9AE]/40 dark:border-[#3D352D]">
            <iframe
              src={currentTrack.src}
              title={currentTrack.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : isSpotifyTrack ? (
          <div className="my-2 rounded-2xl overflow-hidden bg-[#121212] relative shadow-md border border-[#D9C9AE]/40 dark:border-[#3D352D]">
            <iframe
              src={currentTrack.src}
              title={currentTrack.title}
              className="w-full h-[152px] border-0"
              allow="encrypted-media"
            />
          </div>
        ) : (
          <div className="my-2 p-3 rounded-2xl bg-white/70 dark:bg-[#242424] border border-[#D9C9AE]/60 dark:border-[#3D352D] flex items-center gap-3 relative overflow-hidden shadow-xs apple-glow-card">
            {/* Vinyl / Cover Artwork */}
            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-tr from-[#7A263A] to-[#C24A64] dark:from-[#5C1826] dark:to-[#D2516B] flex items-center justify-center text-white shrink-0 shadow-md">
              {currentTrack.coverUrl ? (
                <img
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  className={`w-full h-full object-cover transition-transform duration-500 ${isPlaying ? 'scale-105' : 'scale-100'}`}
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <Music className={`w-6 h-6 ${isPlaying ? 'scale-110 animate-pulse' : 'scale-100'}`} />
              )}
              {isPlaying && (
                <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              )}
            </div>

            {/* Title & Artist & License info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-serif font-bold text-sm sm:text-base text-[#29241F] dark:text-[#F5F5F5] truncate leading-tight glow-text-title">
                {currentTrack.title}
              </h4>
              <p className="text-xs text-[#847768] dark:text-[#B0B0B0] truncate mt-0.5 font-medium glow-text-sub">
                {currentTrack.artist}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-[#7A263A] dark:text-[#D2516B] bg-[#7A263A]/10 dark:bg-[#D2516B]/15 px-1.5 py-0.2 rounded font-medium truncate max-w-[170px]">
                  {currentTrack.categoryLabel}
                </span>
                {currentTrack.license && (
                  <span className="text-[9.5px] text-[#847768] dark:text-[#888888] truncate italic">
                    {currentTrack.license.includes('http') ? 'Creative Commons' : currentTrack.license}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar (Apple Wine colored) - Only for audio streams */}
        {!isYoutubeTrack && !isSpotifyTrack && (
          <div className="space-y-1 my-2">
            <div className="relative group flex items-center">
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.5}
                value={currentTime}
                onChange={(e) => onSeek(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#D9C9AE] dark:bg-[#3D352D] rounded-lg appearance-none cursor-pointer accent-[#7A263A] dark:accent-[#D2516B] transition-all hover:h-2"
                aria-label="Thanh tiến trình phát nhạc"
              />
            </div>
            <div className="flex justify-between items-center text-[10.5px] font-mono text-[#847768] dark:text-[#B0B0B0]">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        )}

        {/* Primary Controls (Shuffle, Prev, Play/Pause, Next, Repeat) */}
        <div className="flex items-center justify-between pt-1">
          {/* Shuffle Toggle */}
          <button
            onClick={onToggleShuffle}
            className={`p-2 rounded-xl transition-all hover:scale-110 active:scale-95 cursor-pointer apple-glow-btn ${
              isShuffle
                ? 'text-[#7A263A] dark:text-[#D2516B] bg-[#7A263A]/10 dark:bg-[#D2516B]/20'
                : 'text-[#847768] dark:text-[#B0B0B0] hover:text-[#29241F] dark:hover:text-[#F5F5F5]'
            }`}
            title={isShuffle ? 'Đang phát ngẫu nhiên (Bật)' : 'Phát theo thứ tự (Tắt)'}
            aria-label="Phát ngẫu nhiên"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          {/* Previous Track */}
          <button
            onClick={onPrevTrack}
            className="p-2.5 rounded-xl text-[#29241F] dark:text-[#F5F5F5] hover:bg-[#EFE4D0] dark:hover:bg-[#282828] transition-all hover:scale-110 active:scale-90 cursor-pointer apple-glow-btn"
            title="Bài trước đó"
            aria-label="Bài trước đó"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          {/* Big Play / Pause Button (Apple Wine Style) */}
          <button
            onClick={onTogglePlay}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7A263A] to-[#5C1826] dark:from-[#D2516B] dark:to-[#A83248] text-white flex items-center justify-center shadow-lg shadow-[#7A263A]/25 dark:shadow-[#D2516B]/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer apple-glow-btn"
            title={isPlaying ? 'Tạm dừng (Pause)' : 'Phát nhạc (Play)'}
            aria-label={isPlaying ? 'Tạm dừng' : 'Phát nhạc'}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-0.5" />
            )}
          </button>

          {/* Next Track */}
          <button
            onClick={onNextTrack}
            className="p-2.5 rounded-xl text-[#29241F] dark:text-[#F5F5F5] hover:bg-[#EFE4D0] dark:hover:bg-[#282828] transition-all hover:scale-110 active:scale-90 cursor-pointer apple-glow-btn"
            title="Bài tiếp theo"
            aria-label="Bài tiếp theo"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          {/* Repeat Toggle */}
          <button
            onClick={onToggleRepeat}
            className={`p-2 rounded-xl transition-all hover:scale-110 active:scale-95 cursor-pointer apple-glow-btn ${
              repeatMode !== 'off'
                ? 'text-[#7A263A] dark:text-[#D2516B] bg-[#7A263A]/10 dark:bg-[#D2516B]/20'
                : 'text-[#847768] dark:text-[#B0B0B0] hover:text-[#29241F] dark:hover:text-[#F5F5F5]'
            }`}
            title={
              repeatMode === 'one'
                ? 'Lặp lại 1 bài'
                : repeatMode === 'all'
                ? 'Lặp lại toàn bộ danh sách'
                : 'Không lặp lại'
            }
            aria-label="Chế độ lặp lại"
          >
            {repeatMode === 'one' ? (
              <Repeat1 className="w-4 h-4" />
            ) : (
              <Repeat className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Volume Slider Bar (For Audio streams) */}
        {!isYoutubeTrack && !isSpotifyTrack && (
          <div className="flex items-center gap-2 pt-3 mt-1 border-t border-[#D9C9AE]/40 dark:border-[#3D352D]">
            <button
              onClick={onToggleMute}
              className="text-[#847768] dark:text-[#B0B0B0] hover:text-[#29241F] dark:hover:text-[#F5F5F5] transition-colors p-1"
              title={isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
              aria-label="Bật tắt tiếng"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-500" />
              ) : volume < 0.5 ? (
                <Volume1 className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="flex-1 h-1 bg-[#D9C9AE] dark:bg-[#3D352D] rounded-lg appearance-none cursor-pointer accent-[#7A263A] dark:accent-[#D2516B]"
              aria-label="Thanh điều chỉnh âm lượng"
            />
            <span className="text-[10px] font-mono text-[#847768] dark:text-[#B0B0B0] w-7 text-right">
              {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
            </span>
          </div>
        )}

        {/* Playlist Drawer (When open) */}
        {showPlaylist && (
          <div className="mt-3 pt-3 border-t border-[#D9C9AE] dark:border-[#3D352D] animate-apple-fade">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#29241F] dark:text-[#F5F5F5] flex items-center gap-1.5 glow-text-title">
                <ListMusic className="w-3.5 h-3.5 text-[#7A263A] dark:text-[#D2516B]" />
                Danh sách bài ({playlist.length})
              </span>
              <div className="flex items-center gap-2">
                {onRefreshJamendo && savedClientId && selectedCategory !== 'youtube' && selectedCategory !== 'spotify' && (
                  <button
                    onClick={onRefreshJamendo}
                    disabled={isLoadingApi}
                    className="text-[11px] text-[#847768] dark:text-[#B0B0B0] hover:text-[#7A263A] dark:hover:text-[#D2516B] inline-flex items-center gap-1 cursor-pointer"
                    title="Tải bài mới từ Jamendo"
                  >
                    <RefreshCw className={`w-3 h-3 ${isLoadingApi ? 'animate-spin' : ''}`} />
                    Làm mới
                  </button>
                )}
                <button
                  onClick={() => setShowCustomModal(true)}
                  className="text-[11px] text-[#7A263A] dark:text-[#D2516B] hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  Thêm nhạc (YouTube/Spotify/File)
                </button>
              </div>
            </div>

            <div className="max-h-52 overflow-y-auto space-y-1 pr-1">
              {playlist.map((track, idx) => {
                const isSelected = track.id === currentTrack.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => onSelectTrack(track)}
                    className={`p-2 rounded-xl text-xs flex items-center justify-between gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] apple-glow-card ${
                      isSelected
                        ? 'bg-[#7A263A]/10 dark:bg-[#D2516B]/20 text-[#7A263A] dark:text-[#D2516B] font-semibold border border-[#7A263A]/30 dark:border-[#D2516B]/30'
                        : 'bg-white/50 dark:bg-[#25201C] text-[#29241F] dark:text-[#F5F5F5] hover:bg-white dark:hover:bg-[#2A2A2A] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-[10px] text-[#847768] dark:text-[#888888] font-mono w-4 shrink-0">
                        {idx + 1}
                      </span>
                      {track.coverUrl ? (
                        <img
                          src={track.coverUrl}
                          alt=""
                          className="w-7 h-7 rounded-lg object-cover shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-[#7A263A]/10 dark:bg-[#D2516B]/20 text-[#7A263A] dark:text-[#D2516B] flex items-center justify-center shrink-0">
                          <Music className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <div className="truncate min-w-0">
                        <div className="flex items-center gap-1">
                          <p className="truncate leading-tight glow-text-title">{track.title}</p>
                          {track.platform === 'youtube' && (
                            <span className="text-[9px] px-1 bg-red-500/20 text-red-600 rounded">YT</span>
                          )}
                          {track.platform === 'spotify' && (
                            <span className="text-[9px] px-1 bg-emerald-500/20 text-emerald-600 rounded">Sp</span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#847768] dark:text-[#B0B0B0] truncate font-normal glow-text-sub">
                          {track.artist}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {isSelected && isPlaying ? (
                        <span className="flex space-x-0.5 items-end h-3">
                          <span className="w-0.5 h-3 bg-[#7A263A] dark:bg-[#D2516B] animate-pulse"></span>
                          <span className="w-0.5 h-2 bg-[#7A263A] dark:bg-[#D2516B] animate-pulse delay-75"></span>
                          <span className="w-0.5 h-3.5 bg-[#7A263A] dark:bg-[#D2516B] animate-pulse delay-150"></span>
                        </span>
                      ) : (
                        track.duration && (
                          <span className="text-[10px] text-[#847768] dark:text-[#888888] font-mono">
                            {formatTime(track.duration)}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Jamendo API Client ID Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-apple-fade">
          <div className="w-full max-w-lg bg-[#FAF6EE] dark:bg-[#1E1E1E] border border-[#D9C9AE] dark:border-[#3D352D] rounded-3xl p-6 shadow-2xl text-[#29241F] dark:text-[#F5F5F5] animate-apple-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9C9AE]/50 dark:border-[#3D352D]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#7A263A]/10 dark:bg-[#D2516B]/20 text-[#7A263A] dark:text-[#D2516B] flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#29241F] dark:text-[#F5F5F5]">
                    Cấu Hình Jamendo Music API
                  </h3>
                  <p className="text-xs text-[#847768] dark:text-[#B0B0B0]">
                    Kết nối nguồn nhạc trực tuyến chính thống
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-1 rounded-lg hover:bg-[#EFE4D0] dark:hover:bg-[#282828] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-[#242424] border border-[#D9C9AE]/70 dark:border-[#3D352D] space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-[#554C42] dark:text-[#C5BDB5] leading-relaxed">
                    <b>Jamendo</b> cung cấp hơn 500.000 bài hát bản quyền <b>Creative Commons</b> hợp pháp. Bạn có thể đăng ký tài khoản lập trình viên hoàn toàn miễn phí để nhận <b>Client ID</b> cá nhân.
                  </p>
                </div>
                <div className="pt-1 flex items-center justify-between border-t border-[#D9C9AE]/30 dark:border-[#3D352D]">
                  <span className="text-[#847768] dark:text-[#999999]">Cổng đăng ký Client ID:</span>
                  <a
                    href="https://devportal.jamendo.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#7A263A] dark:text-[#D2516B] hover:underline font-semibold inline-flex items-center gap-1"
                  >
                    <span>devportal.jamendo.com</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Client ID Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#29241F] dark:text-[#F5F5F5] flex items-center justify-between">
                  <span>Client ID của bạn</span>
                  {savedClientId ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-normal text-[11px] flex items-center gap-1">
                      <Check className="w-3 h-3" /> Đang sử dụng
                    </span>
                  ) : (
                    <span className="text-[#847768] dark:text-[#888888] font-normal text-[11px]">
                      Chưa cấu hình (đang dùng 50 bài chuẩn)
                    </span>
                  )}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputClientId}
                    onChange={(e) => {
                      setInputClientId(e.target.value);
                      setTestResult(null);
                    }}
                    placeholder="Dán Client ID (VD: a1b2c3d4...)"
                    className="flex-1 px-3.5 py-2.5 text-xs rounded-xl bg-white dark:bg-[#242424] border border-[#D9C9AE] dark:border-[#3D352D] text-[#29241F] dark:text-[#F5F5F5] focus:outline-none focus:border-[#7A263A] dark:focus:border-[#D2516B] font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleTestJamendo}
                    disabled={isTesting || !inputClientId.trim()}
                    className="px-3.5 py-2.5 bg-[#EFE4D0] dark:bg-[#2C2C2C] text-[#29241F] dark:text-[#F5F5F5] text-xs font-medium rounded-xl hover:bg-[#E2D4BC] dark:hover:bg-[#383838] disabled:opacity-50 cursor-pointer transition-all inline-flex items-center gap-1.5 shrink-0"
                  >
                    {isTesting ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                    Kiểm tra
                  </button>
                </div>
              </div>

              {testResult && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-start gap-2.5 ${
                    testResult.success
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20'
                  }`}
                >
                  {testResult.success ? (
                    <Check className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  )}
                  <p className="leading-relaxed">{testResult.message}</p>
                </div>
              )}

              <p className="text-[11px] text-[#847768] dark:text-[#888888] italic">
                * Lưu ý: Client ID chỉ được lưu trữ nội bộ trên trình duyệt của bạn (localStorage), tuyệt đối an toàn và không bao giờ bị lộ ra ngoài.
              </p>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#D9C9AE]/40 dark:border-[#3D352D]">
                {savedClientId ? (
                  <button
                    type="button"
                    onClick={handleRemoveJamendo}
                    className="px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl cursor-pointer"
                  >
                    Xóa & Khôi phục 50 bài chuẩn
                  </button>
                ) : (
                  <span />
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSettingsModal(false)}
                    className="px-3.5 py-2 text-xs font-medium text-[#554C42] dark:text-[#B0B0B0] hover:bg-[#EFE4D0] dark:hover:bg-[#282828] rounded-xl cursor-pointer"
                  >
                    Đóng
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveJamendo}
                    disabled={!inputClientId.trim()}
                    className="px-4 py-2 bg-[#7A263A] dark:bg-[#D2516B] text-white text-xs font-semibold rounded-xl hover:bg-[#5C1826] dark:hover:bg-[#A83248] disabled:opacity-50 cursor-pointer shadow-xs apple-glow-btn"
                  >
                    Lưu & Sử dụng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Track Modal (Supports YouTube links, Spotify links, Direct Audio / File) */}
      {showCustomModal && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-apple-fade">
          <div className="w-full max-w-lg bg-[#FAF6EE] dark:bg-[#1E1E1E] border border-[#D9C9AE] dark:border-[#3D352D] rounded-3xl p-6 shadow-2xl text-[#29241F] dark:text-[#F5F5F5] animate-apple-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9C9AE]/50 dark:border-[#3D352D]">
              <h3 className="font-serif font-bold text-lg text-[#29241F] dark:text-[#F5F5F5] flex items-center gap-2">
                <Music className="w-5 h-5 text-[#7A263A] dark:text-[#D2516B]" />
                Thêm Nhạc (YouTube, Spotify hoặc Tệp)
              </h3>
              <button
                onClick={() => setShowCustomModal(false)}
                className="p-1 rounded-lg hover:bg-[#EFE4D0] dark:hover:bg-[#282828] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <p className="text-xs text-[#554C42] dark:text-[#B0B0B0] leading-relaxed">
                Dán đường dẫn YouTube hoặc Spotify để nghe trực tiếp ngay bên trong website khi viết văn, hoặc tải lên file âm thanh từ máy.
              </p>

              {/* Option 1: File Upload */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#242424] border border-dashed border-[#D9C9AE] dark:border-[#3D352D] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Upload className="w-5 h-5 text-[#7A263A] dark:text-[#D2516B]" />
                  <div>
                    <p className="text-xs font-semibold text-[#29241F] dark:text-[#F5F5F5]">Tải tệp MP3/WAV từ thiết bị</p>
                    <p className="text-[10px] text-[#847768] dark:text-[#888888]">Phát trực tiếp không cần mạng</p>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="music-file-upload-input"
                />
                <label
                  htmlFor="music-file-upload-input"
                  className="px-3 py-1.5 bg-[#EFE4D0] dark:bg-[#2C2C2C] text-[#29241F] dark:text-[#F5F5F5] text-xs font-semibold rounded-xl hover:bg-[#E2D4BC] dark:hover:bg-[#383838] cursor-pointer transition-all"
                >
                  Chọn tệp
                </label>
              </div>

              {/* Option 2: Paste YouTube / Spotify Link */}
              <form onSubmit={handleAddParsedMedia} className="space-y-3 pt-1">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#29241F] dark:text-[#F5F5F5] flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-[#7A263A] dark:text-[#D2516B]" />
                    Dán đường dẫn YouTube hoặc Spotify:
                  </label>
                  <input
                    type="text"
                    placeholder="VD: https://www.youtube.com/watch?v=... hoặc https://open.spotify.com/track/..."
                    value={mediaInputUrl}
                    onChange={(e) => setMediaInputUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white dark:bg-[#242424] border border-[#D9C9AE] dark:border-[#3D352D] text-[#29241F] dark:text-[#F5F5F5] focus:outline-none focus:border-[#7A263A] dark:focus:border-[#D2516B] font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-[#847768] dark:text-[#B0B0B0] block mb-1">Tên bài (tùy chọn)</label>
                    <input
                      type="text"
                      placeholder="VD: Lo-fi Study Beats"
                      value={customTitleInput}
                      onChange={(e) => setCustomTitleInput(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#242424] border border-[#D9C9AE] dark:border-[#3D352D] text-[#29241F] dark:text-[#F5F5F5]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-[#847768] dark:text-[#B0B0B0] block mb-1">Chủ đề bài hát</label>
                    <select
                      value={selectedCategoryForAdd}
                      onChange={(e) => setSelectedCategoryForAdd(e.target.value as MusicCategory)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#242424] border border-[#D9C9AE] dark:border-[#3D352D] text-[#29241F] dark:text-[#F5F5F5]"
                    >
                      {MUSIC_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Live Preview Card */}
                {previewParsed && (
                  <div className={`p-3 rounded-2xl text-xs border flex items-center gap-3 ${
                    previewParsed.track ? 'bg-white/80 dark:bg-[#242424] border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
                  }`}>
                    {previewParsed.track ? (
                      <>
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                          <img src={previewParsed.track.coverUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1 font-semibold text-[#29241F] dark:text-[#F5F5F5] truncate">
                            <span>{previewParsed.track.title}</span>
                            <span className="text-[9px] px-1 py-0.2 bg-emerald-500/20 text-emerald-600 rounded uppercase">
                              {previewParsed.platform}
                            </span>
                          </div>
                          <p className="text-[10px] text-[#847768] dark:text-[#B0B0B0] truncate">Sẵn sàng thêm vào danh sách</p>
                        </div>
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{previewParsed.error}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2 border-t border-[#D9C9AE]/40 dark:border-[#3D352D]">
                  <button
                    type="button"
                    onClick={() => setShowCustomModal(false)}
                    className="px-3.5 py-2 text-xs font-medium text-[#554C42] dark:text-[#B0B0B0] hover:bg-[#EFE4D0] dark:hover:bg-[#282828] rounded-xl cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={!previewParsed || !previewParsed.track}
                    className="px-4 py-2 bg-[#7A263A] dark:bg-[#D2516B] text-white text-xs font-semibold rounded-xl hover:bg-[#5C1826] dark:hover:bg-[#A83248] disabled:opacity-50 cursor-pointer shadow-xs apple-glow-btn"
                  >
                    Thêm vào danh sách phát
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
