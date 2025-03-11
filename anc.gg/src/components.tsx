import Image from "next/image";

interface SummonerInfo {
  profileIconId: number;
}

const ProfileIcon = ({ summonerInfo }: { summonerInfo: SummonerInfo }) => {
  const imageUrl = `https://ddragon.leagueoflegends.com/cdn/14.4.1/img/profileicon/${summonerInfo.profileIconId}.png`;
  // const imageUrl = "https://ddragon.leagueoflegends.com/cdn/15.5.1/img/profileicon/685.png"

  return (
    <div className="flex items-center space-x-4">
      <img src={imageUrl} alt="Profile Icon" width={64} height={64} className="rounded-full" />
      <span className="text-lg font-semibold">Summoner Profile</span>
    </div>
  );
};

export default ProfileIcon;