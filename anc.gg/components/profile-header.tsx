import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Image } from "@heroui/image";

interface SummonerInfo {
  profileIconId: number;
  gameName: string;
  tagLine: string;
  summonerLevel: number;
}

const ProfileHeader = ({ summonerInfo }: { summonerInfo: SummonerInfo }) => {
  const imageUrl = `https://ddragon.leagueoflegends.com/cdn/14.4.1/img/profileicon/${summonerInfo.profileIconId}.png`;

  return (
    <div>
      <Card className="flex gap-2 md:mx-auto md:w-width-limit relative p-3 md:flex-col md:gap-[11px] md:gap-x-2.5 md:p-0">
        <CardHeader className="flex gap-3 md:gap-6">
          <div className="flex w-16 basis-16 flex-col gap-2 md:w-[100px] md:basis-[100px]">
            <Image
              alt="Icon"
              height={100}
              radius="sm"
              src={imageUrl}
              width={100}
            />
          </div>
          <div className="flex w-[calc(100%-76px)] flex-col gap-2 md:w-full md:flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex flex-col flex-wrap gap-[6px]">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1 truncate text-[20px] leading-7 md:text-[24px]">
                    <span className="whitespace-pre-wrap text-default-900 font-bold">
                      {summonerInfo.gameName}
                    </span>
                    <span className="truncate text-default-500 whitespace-pre-wrap">
                      #{summonerInfo.tagLine}
                    </span>
                  </div>
                </div>
                <ul className='flex flex-wrap items-center gap-2 text-xs text-gray-500 [&_li+li]:relative [&_li+li]:pl-2 [&_li+li]:before:absolute [&_li+li]:before:left-0 [&_li+li]:before:right-auto [&_li+li]:before:top-[3px] [&_li+li]:before:h-2.5 [&_li+li]:before:w-[1px] [&_li+li]:before:bg-gray-300 [&_li+li]:before:content-[""]'>
                  <li className="flex items-center gap-1">
                    Level: {summonerInfo.summonerLevel}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};

export default ProfileHeader;
