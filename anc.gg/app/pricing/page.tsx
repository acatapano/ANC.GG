'use client';

import { useState, useMemo } from 'react';
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem } from "@heroui/dropdown";
import { callPostAPIGateway, callPostLambda } from '../../src/requests';
import ProfileIcon from "../../src/components";

export default function SearchComponent() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('option1');
  const [accountInfo, setAccountInfo] = useState<any>(null);
  const [summonerInfo, setSummonerInfo] = useState<any>(null);
  const [rankedInfo, setRankedInfo] = useState<any>(null);
  const [matchList, setMatchList] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(new Set(["americas"]));

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", ").replace(/_/g, ""),
    [selectedKeys],
  );

  const handleSearch = async () => {
    setAccountInfo(null);
    setSummonerInfo(null);
    setRankedInfo(null);
    
    if (!query) return;
    setLoading(true);
  
    try {
        const region = Array.from(selectedKeys)[0]; // Convert Set to string
        
        // First API call
        const accountData = await callPostAPIGateway('account-v1', { region, name_tag: query });
        console.log(accountData);
        setAccountInfo(accountData);
        
        // Ensure accountInfo is available before proceeding
        if (!accountData?.puuid) throw new Error("Account data is missing PUUID");
        
        // Second API call
        const summonerData = await callPostAPIGateway('summoner-v4', { region, puuid: accountData.puuid });
        console.log(summonerData);
        setSummonerInfo(summonerData);
        
        // Ensure summonerInfo is available before proceeding
        if (!summonerData?.id) throw new Error("Summoner data is missing ID");
        
        // Third API call
        const rankedData = await callPostAPIGateway('league-v4', { region, id: summonerData.id });
        console.log(rankedData);
        setRankedInfo(rankedData[0]); // Assuming the first entry is for Solo/Duo Ranking

        // Ensure rankedInfo is available before proceding
        if (!accountData?.puuid) throw new Error("Ranked data missing PUUID");

        const matchListData = await callPostAPIGateway('match-v5', { region, puuid: accountData.puuid });
        console.log(matchListData);
        setMatchList(matchListData); // Assuming the first entry is for Solo/Duo Ranking
        
    } catch (error) {
        console.error("API call failed:", error);
    } finally {
        setLoading(false); // Ensure loading is disabled after all API calls
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <div className="flex space-x-2">
        {/* NEED FULL DROPDOWN FOR ALL REGIONS LIKE OP.GG FOR SUMMONER-V4 & LEAGUE-V4 API REGION TAGS --> Explanation found in Math-V5*/}
        <Dropdown>
          <DropdownTrigger>
            <Button className="capitalize" variant="bordered">
              {selectedValue}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Single selection example"
            selectedKeys={selectedKeys}
            selectionMode="single"
            variant="flat"
            onSelectionChange={setSelectedKeys}
          >
            <DropdownItem key="americas">Americas</DropdownItem>
            <DropdownItem key="asia">Asia</DropdownItem>
            <DropdownItem key="europe">Europe</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Input 
          type="text"
          label="Search"
          placeholder="Game Name + Tag Line" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
        />
        <Button onPress={handleSearch} disabled={loading}>Search</Button>
      </div>
      {loading && <p>Loading...</p>}
      <div>
        {selectedKeys}
        {query}
      </div>
      {accountInfo && (
        <div>
          <h2>Account Info</h2>
          <p><strong>Game Name:</strong> {accountInfo.gameName}</p>
          <p><strong>Tag Line:</strong> {accountInfo.tagLine}</p>
          <p><strong>PUUID:</strong> {accountInfo.puuid}</p>
        </div>
      )}
      {summonerInfo && (
        <div>
          <h2>Summoner Info</h2>
          <p><strong>id:</strong> {summonerInfo.id}</p>
          <p><strong>Account ID:</strong> {summonerInfo.accountId}</p>
          <p><strong>PUUID:</strong> {summonerInfo.puuid}</p>
          <p><strong>Profile Icon ID:</strong> {summonerInfo.profileIconId}</p>
          <ProfileIcon summonerInfo={summonerInfo} />
          <p><strong>Revision Date:</strong> {summonerInfo.revisionDate}</p>
          <p><strong>Summoner Level:</strong> {summonerInfo.summonerLevel}</p>
        </div>
      )}
      {rankedInfo && (
        <div>
          <h2>Ranked Info</h2>
          <p><strong>League ID:</strong> {rankedInfo.leagueId}</p>
          <p><strong>Queue Type:</strong> {rankedInfo.queueType}</p>
          <p><strong>Tier:</strong> {rankedInfo.tier}</p>
          <p><strong>Rank:</strong> {rankedInfo.rank}</p>
          <p><strong>Summoner ID:</strong> {rankedInfo.summonerId}</p>
          <p><strong>PUUID:</strong> {rankedInfo.puuid}</p>
          <p><strong>League Points:</strong> {rankedInfo.leaguePoints}</p>
          <p><strong>Wins:</strong> {rankedInfo.wins}</p>
          <p><strong>Losses:</strong> {rankedInfo.losses}</p>
          <p><strong>Veteran:</strong> {rankedInfo.veteran}</p>
          <p><strong>Inactive:</strong> {rankedInfo.inactive}</p>
          <p><strong>freshBlood:</strong> {rankedInfo.freshBlood}</p>
          <p><strong>Hot Streak:</strong> {rankedInfo.hotStreak}</p>
        </div>
      )}
      {matchList && (
        <div>
          <h2>Match List</h2>
          <p><strong>Matches:</strong> {matchList.toString()}</p>
        </div>
      )}
    </div>
  );
}