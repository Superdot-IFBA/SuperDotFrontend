import React, { useEffect, useRef, useState } from "react";
import * as Icon from "@phosphor-icons/react";
import { Flex, Text, Box } from "@radix-ui/themes";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface VideoPlayerProps {
  videoUrl: string;
  onTimeUpdate?: (currentTime: number) => void;
  className?: string;
  playerRef?: React.MutableRefObject<any>;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  onTimeUpdate,
  className = "",
  playerRef,
}) => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isYouTube, setIsYouTube] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const getYouTubeVideoId = (url: string): string | null => {
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const formatTime = (s: number): string => {
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    const youtubeId = getYouTubeVideoId(videoUrl);
    setIsYouTube(!!youtubeId);
    if (!youtubeId) {
      setError("Formato de vídeo não suportado ou inválido");
    } else {
      setError(null);
    }
  }, [videoUrl]);

  useEffect(() => {
    if (!isYouTube) return;

    const videoId = getYouTubeVideoId(videoUrl);
    if (!videoId || !containerRef.current) return;

    if (!window.YT || !window.YT.Player) {

      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = () => {
      const player = new window.YT.Player(containerRef.current!, {
        videoId,
        playerVars: {
          controls: 1,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (
              event.data === window.YT.PlayerState.PAUSED ||
              event.data === window.YT.PlayerState.ENDED
            ) {
              setIsPlaying(false);
            }
          },
        },
      });

      if (playerRef) {
        playerRef.current = player;
      }
    };

    if (window.YT && window.YT.Player) {
      window.onYouTubeIframeAPIReady();
    }
  }, [isYouTube, videoUrl, playerRef]);

  useEffect(() => {
    if (!isYouTube || !playerRef?.current) return;

    const interval = setInterval(() => {
      const t = playerRef.current?.getCurrentTime?.();
      if (typeof t === "number") {
        setCurrentTime(t);
        onTimeUpdate?.(t);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isYouTube, playerRef?.current]);

  if (error) {
    return (
      <Box className={`p-8 bg-gray-100 rounded-lg text-center ${className}`}>
        <Icon.WarningCircle size={48} className="text-red-500 mb-4" />
        <Text className="text-red-700 font-semibold">Erro no vídeo</Text>
        <Text size="2" className="text-red-600">{error}</Text>
      </Box>
    );
  }

  if (isYouTube) {
    return (
      <Box className={`flex flex-col items-center ${className}`}>
        <div
          ref={el => {
            containerRef.current = el;
          }}
          className="w-full aspect-video max-w-4xl rounded-lg overflow-hidden shadow-lg"
        />
        <Flex
          align="center"
          justify="between"
          className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg max-w-2xl w-full"
        >
          <Flex align="center" gap="2">
            <div
              className={`w-3 h-3 rounded-full ${isPlaying ? "bg-green-500" : "bg-yellow-500"
                }`}
            ></div>
            <Text size="2" className="font-medium">
              {isPlaying ? "Reproduzindo" : "Pausado"}
            </Text>
          </Flex>

          <Flex align="center" gap="2">
            <Icon.Clock size={16} className="text-gray-600" />
            <Text size="2" className="font-medium text-gray-700">
              {formatTime(currentTime)}
            </Text>
          </Flex>
        </Flex>
      </Box>
    );
  }

  return null;
};

export default VideoPlayer;
