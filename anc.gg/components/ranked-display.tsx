import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Image } from "@heroui/image";

interface RankedInfo {
  tier: string;
  rank: string;
  lp: number;
  wins: number;
  losses: number;
}

const RankedDisplay = ({ summonerInfo }: { summonerInfo: RankedInfo }) => {
  const imageUrl = `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-emblem/emblem-${summonerInfo.tier.toLowerCase()}.png`;

  // Calculate winrate
  const winrate = (
    (summonerInfo.wins / (summonerInfo.wins + summonerInfo.losses)) *
    100
  ).toFixed(1);

  return (
    <div>
      <Card className="max-w-[400px]">
        <CardHeader className="flex gap-3">
          <div className="flex flex-col">
            <p className="text-small text-default-500">Ranked Solo/Duo:</p>
          </div>
        </CardHeader>
        <CardBody className="flex justify-between items-center flex-col gap-3">
          <div className="flex w-full flex-col gap-3 p-3">
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-1 items-center gap-4">
                <Image
                  alt="Rank Icon"
                  height={64}
                  radius="sm"
                  src={imageUrl}
                  width={64}
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
                <div className="flex flex-col gap-0.5">
                  <strong className="text-xl first-letter:uppercase">
                    {summonerInfo.tier.toLowerCase()} {summonerInfo.rank}
                  </strong>
                  <span className="text-xs text-default-500">
                    {summonerInfo.lp} LP
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-0.5 text-right text-xs text-gray-400">
                <span className="leading-[26px]">
                  {summonerInfo.wins}W {summonerInfo.losses}L
                </span>
                <span>{winrate}% Winrate</span>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default RankedDisplay;
