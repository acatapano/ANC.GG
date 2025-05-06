"use client";

import { useState, useMemo } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { callPostAPIGateway } from "../../src/requests";
import ProfileHeader from "../../components/profile-header";
import RankedDisplay from "../../components/ranked-display";
import MatchDisplay from "../../components/match-display";
import { Card } from "@heroui/card";

export default function SearchComponent() {
  const [query, setQuery] = useState("");
  const [accountInfo, setAccountInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(new Set(["americas"]));

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", ").replace(/_/g, ""),
    [selectedKeys],
  );

  const handleSearch = async () => {
    setAccountInfo(null);

    if (!query) return;
    setLoading(true);

    try {
      const region = "americas"; // Array.from(selectedKeys)[0]; // Convert Set to string

      // Master API Call:
      const response = await callPostAPIGateway("anc.gg", {
        region,
        name_tag: query,
      });

      // Parse the JSON string from the 'body' field
      const accountData = JSON.parse(response.body);

      // Set the parsed accountData to the state
      console.log(accountData);
      setAccountInfo(accountData);
    } catch (error) {
      console.error("API call failed:", error);
    } finally {
      setLoading(false); // Ensure loading is disabled after all API calls
    }
  };

  const handleRefresh = async () => {
    setAccountInfo(null);

    if (!query) return;
    setLoading(true);

    try {
      const region = Array.from(selectedKeys)[0]; // Convert Set to string

      // Master API Call:
      const response = await callPostAPIGateway("anc.gg", {
        region,
        name_tag: query,
        refresh: true,
      });

      // Parse the JSON string from the 'body' field
      const accountData = JSON.parse(response.body);

      // Set the parsed accountData to the state
      console.log(accountData);
      setAccountInfo(accountData);
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
        {/*<Dropdown>
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
        </Dropdown>*/}
        <Input
          type="text"
          label="Search"
          placeholder="Game Name + Tag Line"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onPress={handleSearch} disabled={loading}>
          Search
        </Button>
        {accountInfo && (
          <Button onPress={handleRefresh} disabled={loading}>
            Refresh
          </Button>
        )}
      </div>
      {loading && <p>Loading...</p>}
      {accountInfo && (
        <div>
          <ProfileHeader summonerInfo={accountInfo} />
          <div className="flex flex-col gap-2 md:flex-row">
            <aside className="flex flex-col gap-2 md:w-[332px] md:basis-[332px]">
              <RankedDisplay summonerInfo={accountInfo} />
            </aside>
            <main className="flex flex-1 flex-col gap-2">
              <Card className="flex flex-col gap-[8px] md:max-w-[740px]">
                {/* Loop through matches and render MatchDisplay for each */}
                {accountInfo.matches.map((match: any, index: number) => (
                  <MatchDisplay key={index} matchInfo={match} />
                ))}
              </Card>
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
