import React from 'react';
import Svg, { Path, Circle, Rect, G, Polygon, LinearGradient, Defs, Stop } from 'react-native-svg';
import { StyleProp, ViewStyle } from 'react-native';

interface IconProps {
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

interface StarIconProps extends IconProps {
  filled?: boolean;
}

// 🎮 Gamepad Icon
export const GamepadIcon: React.FC<IconProps> = ({ size = 24, color = '#6366F1', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M6 15h2v2H6v-2zm0-4h2v2H6v-2zm4 2h2v2h-2v-2zm0-4h2v2h-2v-2zm5 1a1 1 0 100-2 1 1 0 000 2zm2 2a1 1 0 100-2 1 1 0 000 2zm-2 2a1 1 0 100-2 1 1 0 000 2zm4-2a1 1 0 100-2 1 1 0 000 2z"
      fill={color}
    />
    <Path
      d="M17 5H7a5 5 0 00-5 5v4a5 5 0 005 5h10a5 5 0 005-5v-4a5 5 0 00-5-5zm3 9a3 3 0 01-3 3H7a3 3 0 01-3-3v-4a3 3 0 013-3h10a3 3 0 013 3v4z"
      fill={color}
    />
  </Svg>
);

// ⭐ Star Icon
export const StarIcon: React.FC<StarIconProps> = ({ size = 24, color = '#F59E0B', filled = true, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      fill={filled ? color : 'none'}
      stroke={color}
      strokeWidth={filled ? '0' : '2'}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// 📥 Download Icon
export const DownloadIcon: React.FC<IconProps> = ({ size = 24, color = '#10B981', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ⚙️ Settings / Gear Icon
export const SettingsIcon: React.FC<IconProps> = ({ size = 24, color = '#6B7280', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" />
  </Svg>
);

// ← Back Icon
export const BackIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M19 12H5m0 0l7 7m-7-7l7-7"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ▶ Play Icon
export const PlayIcon: React.FC<IconProps> = ({ size = 24, color = '#10B981', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path d="M8 5v14l11-7z" fill={color} />
  </Svg>
);

// ⏸ Pause Icon
export const PauseIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill={color} />
  </Svg>
);

// 🔄 Refresh / Retry Icon
export const RefreshIcon: React.FC<IconProps> = ({ size = 24, color = '#6366F1', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// 🏠 Home Icon
export const HomeIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ➔ Next / Arrow Right Icon
export const NextIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M5 12h14m0 0l-7-7m7 7l-7 7"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// 🔒 Lock Icon
export const LockIcon: React.FC<IconProps> = ({ size = 24, color = '#9CA3AF', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Rect x="5" y="11" width="14" height="10" rx="2" fill={color} />
    <Path
      d="M8 11V7a4 4 0 118 0v4"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// 📋 List Icon
export const ListIcon: React.FC<IconProps> = ({ size = 24, color = '#6366F1', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// 📦 Package / Box Icon
export const BoxIcon: React.FC<IconProps> = ({ size = 24, color = '#8B5CF6', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M20 7.5v9l-8 4.5-8-4.5v-9L12 3l8 4.5zM12 3v18M12 12l8-4.5M12 12L4 7.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// 🔥 Flame Icon
export const FlameIcon: React.FC<IconProps> = ({ size = 24, color = '#EF4444', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      fill={color}
    />
    <Path
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      fill="#FBBF24"
    />
  </Svg>
);

// 🆕 Sparkle / Badge Icon
export const SparkleIcon: React.FC<IconProps> = ({ size = 24, color = '#3B82F6', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M12 2l2.4 5.6L20 10l-5.6 2.4L12 18l-2.4-5.6L4 10l5.6-2.4L12 2z"
      fill={color}
    />
    <Path
      d="M19 17l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z"
      fill="#F59E0B"
    />
  </Svg>
);

// 🏆 Trophy Icon
export const TrophyIcon: React.FC<IconProps> = ({ size = 24, color = '#F59E0B', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M8 21h8m-4-4v4m-5-17h10a2 2 0 012 2v3a5 5 0 01-5 5h-4a5 5 0 01-5-5V6a2 2 0 012-2z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5 9A3 3 0 012 6V4h3v5zm14 0h3V4h-3v2a3 3 0 01-3 3z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// 💔 Broken Heart Icon
export const BrokenHeartIcon: React.FC<IconProps> = ({ size = 24, color = '#EF4444', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      fill={color}
    />
    <Path
      d="M12 4l-2 5h4l-2 5"
      stroke="#1F2937"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Svg>
);

// 🧩 Puzzle Piece Icon
export const PuzzlePieceIcon: React.FC<IconProps> = ({ size = 24, color = '#8B5CF6', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M11 4a2 2 0 10-4 0H4v3a2 2 0 100 4v3h3a2 2 0 104 0h3v-3a2 2 0 100-4V4h-3z"
      fill={color}
    />
  </Svg>
);

// 🎯 Target / Bullseye Icon
export const TargetIcon: React.FC<IconProps> = ({ size = 24, color = '#EF4444', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
    <Circle cx="12" cy="12" r="5" stroke={color} strokeWidth="2" />
    <Circle cx="12" cy="12" r="2" fill={color} />
  </Svg>
);

// 🔊 Volume Icon
export const VolumeIcon: React.FC<IconProps> = ({ size = 24, color = '#10B981', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M11 5L6 9H2v6h4l5 4V5zm4.5 3a5 5 0 010 8m2.5-10a9 9 0 010 12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// 👤 User / Profile Icon
export const UserIcon: React.FC<IconProps> = ({ size = 24, color = '#3B82F6', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      fill={color}
    />
  </Svg>
);

// ℹ️ Info Icon
export const InfoIcon: React.FC<IconProps> = ({ size = 24, color = '#6366F1', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
    <Path d="M12 8h.01M12 12v4" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);

// ❓ Help / Question Mark Icon
export const HelpCircleIcon: React.FC<IconProps> = ({ size = 24, color = '#38BDF8', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
    <Path
      d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3m.08 4h.01"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// 🔍 Search Icon
export const SearchIcon: React.FC<IconProps> = ({ size = 24, color = '#64748B', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2.2" />
    <Path d="M16 16l4.5 4.5" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
  </Svg>
);


// ================= MATCH 3 ITEM SVGS =================

// 🍎 Apple SVG
export const AppleSvg: React.FC<IconProps> = ({ size = 32, style }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={style}>
    <Path
      d="M16 6c-2-2-5-2-7 0a8 8 0 00-3 9c1 5 6 12 10 13 4-1 9-8 10-13a8 8 0 00-3-9c-2-2-5-2-7 0z"
      fill="#EF4444"
    />
    <Path
      d="M16 6c1-2 3-3 4-3"
      stroke="#15803D"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Circle cx="12" cy="12" r="2" fill="#FCA5A5" opacity="0.6" />
  </Svg>
);

// 🍓 Strawberry SVG
export const StrawberrySvg: React.FC<IconProps> = ({ size = 32, style }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={style}>
    <Path
      d="M16 28C22 22 26 15 25 10A7 7 0 0016 6 7 7 0 007 10c-1 5 3 12 9 18z"
      fill="#DC2626"
    />
    <Path
      d="M11 6c2 2 5 2 5 0 0 2 3 2 5 0"
      stroke="#22C55E"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <Circle cx="13" cy="13" r="1" fill="#FEF08A" />
    <Circle cx="18" cy="14" r="1" fill="#FEF08A" />
    <Circle cx="15" cy="18" r="1" fill="#FEF08A" />
    <Circle cx="12" cy="21" r="1" fill="#FEF08A" />
    <Circle cx="19" cy="20" r="1" fill="#FEF08A" />
  </Svg>
);

// 🌸 Flower SVG
export const FlowerSvg: React.FC<IconProps> = ({ size = 32, style }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={style}>
    <Circle cx="16" cy="10" r="4" fill="#F472B6" />
    <Circle cx="22" cy="16" r="4" fill="#F472B6" />
    <Circle cx="16" cy="22" r="4" fill="#F472B6" />
    <Circle cx="10" cy="16" r="4" fill="#F472B6" />
    <Circle cx="16" cy="16" r="4" fill="#FBBF24" />
  </Svg>
);

// 🍇 Grapes SVG
export const GrapesSvg: React.FC<IconProps> = ({ size = 32, style }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={style}>
    <Path d="M16 4v4" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" />
    <Circle cx="12" cy="11" r="3.5" fill="#8B5CF6" />
    <Circle cx="20" cy="11" r="3.5" fill="#8B5CF6" />
    <Circle cx="16" cy="15" r="3.5" fill="#7C3AED" />
    <Circle cx="12" cy="19" r="3.5" fill="#6D28D9" />
    <Circle cx="20" cy="19" r="3.5" fill="#6D28D9" />
    <Circle cx="16" cy="24" r="3.5" fill="#5B21B6" />
  </Svg>
);

// 🌻 Sunflower SVG
export const SunflowerSvg: React.FC<IconProps> = ({ size = 32, style }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={style}>
    <Circle cx="16" cy="8" r="3" fill="#F59E0B" />
    <Circle cx="24" cy="16" r="3" fill="#F59E0B" />
    <Circle cx="16" cy="24" r="3" fill="#F59E0B" />
    <Circle cx="8" cy="16" r="3" fill="#F59E0B" />
    <Circle cx="21.6" cy="10.4" r="3" fill="#F59E0B" />
    <Circle cx="21.6" cy="21.6" r="3" fill="#F59E0B" />
    <Circle cx="10.4" cy="21.6" r="3" fill="#F59E0B" />
    <Circle cx="10.4" cy="10.4" r="3" fill="#F59E0B" />
    <Circle cx="16" cy="16" r="5" fill="#78350F" />
  </Svg>
);

// ❓ Unknown SVG
export const UnknownSvg: React.FC<IconProps> = ({ size = 32, color = '#9CA3AF', style }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={style}>
    <Circle cx="16" cy="16" r="13" stroke={color} strokeWidth="2" />
    <Path
      d="M13 12a3 3 0 016 0c0 2-3 3-3 5m0 3h.01"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </Svg>
);
