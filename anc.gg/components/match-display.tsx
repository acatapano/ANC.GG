'use client';

import clsx from "clsx";
import { mappings } from "./mappings";
import React, { useState } from 'react';
  
const MatchDisplay = ({ matchInfo }: { matchInfo: any }) => {
    
    // Helper function to determine if it's a defeat:
    const getMatchOutcome = () => {
        if (matchInfo.blueTeam.stats.win && matchInfo.blueTeam.stats.searchedPlayer) {
            return "Victory";
        } else if (matchInfo.redTeam.stats.win && matchInfo.redTeam.stats.searchedPlayer) {
            return "Victory";
        }
        return "Defeat";
    };

    // Helper function to find searched player's stats:
    const getSearchedPlayerStats = () => {
        if (matchInfo.blueTeam.stats.searchedPlayer) {
            const roster = matchInfo.blueTeam.participants;
            // Loop through blue team participants to find the searched player
            for (let i = 0; i < roster.length; i++) {
                const player = roster[i];
                if (player.searchedPlayer) {
                    return player; // Return the player stats if found
                }
            }
        } else {
            const roster = matchInfo.redTeam.participants;
            // Loop through blue team participants to find the searched player
            for (let i = 0; i < roster.length; i++) {
                const player = roster[i];
                if (player.searchedPlayer) {
                    return player; // Return the player stats if found
                }
            }
        }
    };

    // Helper function to return source to Shampion icon:
    const getChampionIcon = (name: string) => {
        const iconSource = `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/champion/${name}.png`;

        return iconSource.toString();
    };

    // Helper function to return source to Summoner Spell icon:
    const getSummonerSpellIcon = (id: number) => {
        const name = mappings.summonerSpellMapping[id];

        const spellSource = `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/spell/${name}.png`;
        return spellSource.toString();
    };

    // Helper function to return source to Keystone icon:
    const getKeystoneIcon = (id: number) => {
        const name = mappings.keystoneIDMapping[id];
        const tree = mappings.keystoneTreeMapping[name];

        if (name == "lethaltempo") {
            const keystoneSource = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/${tree}/${name}/${name}temp.png`;
            return keystoneSource;
        }

        const keystoneSource = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/${tree}/${name}/${name}.png`;
        return keystoneSource.toString();
    };

    // Helper function to return source to Secondary Tree icon:
    const getSecondaryTreeIcon = (id: number) => {
        const source = mappings.treeIDMapping[id];

        const treeSource = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/${source}.png`;
        return treeSource.toString();
    };

    // Helper function to return if kda is perfect:
    const kdaCheck = (kda: number) => {
        if (kda == 999) {
            return "Perfect";
        }
        return `${kda} KDA`.toString();
    };

    // Helper function to return source to Item icon:
    const getItemIcon = (id: number) => {
        if (id == 0) {
            return undefined;
        }
        
        const source = mappings.itemIDMapping[id];

        const itemSource = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/items/icons2d/${source}`;
        return itemSource.toString();
    };

    // Helper function to get if team won:
    const getWin = (team: any) => {
        if (team.stats.win) {
            return "Victory";
        } else {
            return "Defeat";
        }
    };

    const searchedPlayerStats = getSearchedPlayerStats();

    // State to manage full match visibility:
    const [isVisible, setIsVisible] = useState(false);

    // Toggle the visibility for more indepth match stats when the button is clicked:
    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    // Gets match color:
    const isVictory = getMatchOutcome() === "Victory";
    const matchColor = isVictory ? "blue" : "red";

    return (
        <div>
          <div className={clsx(
            "box-border flex w-full border-l-[6px] md:overflow-hidden md:rounded md:h-auto md:min-h-24",
            // both colors appear literally in your source
            isVictory
            ? "border-blue-500 bg-blue-100" : "border-red-500  bg-red-100"
            )}
        >
            <div className={[`flex flex-1 flex-col`, `bg-${matchColor}-100`].join(" ")}>
                <div className="flex flex-1 flex-col bg-[var(--game-item-color-100)] text-xs text-gray-500 md:flex-row md:items-center md:gap-2 md:p-1 md:px-3">
                    <div className="flex flex-row-reverse items-center justify-between gap-2 border-b border-b-[var(--game-item-color-200)] py-0.5 pl-3 pr-0.5 md:w-[108px] md:flex-col md:items-baseline md:justify-normal md:border-none md:p-0">
                        <div className="flex items-center gap-2 md:flex-col md:items-baseline md:gap-0">
                            <span className="md:font-bold md:text-[var(--game-item-color-600)]">
                                Ranked Solo/Duo
                            </span>
                            <div className="hidden h-[1px] w-12 bg-[var(--game-item-color-200)] md:block"></div>
                        </div>
                        <div className="flex gap-2 md:flex-col md:gap-0">
                            <div className="flex min-h-[17px] items-center gap-1 leading-[17px]">
                                <strong>{getMatchOutcome()}</strong>
                            </div>
                            <span> {matchInfo.matchData.gameDurationMinutes}m {matchInfo.matchData.gameDurationSeconds}s</span>
                        </div>
                    </div>
                    <div className="flex flex-1 gap-0.5 py-1 pl-3 pr-2 md:p-0">
                        <div className="flex flex-1 gap-2 flex-row md:flex-col">
                            <div className="flex flex-1 items-center gap-2 md:gap-3">
                                <div className="flex items-center gap-1">
                                    <a className="relative shrink-0">
                                        <img 
                                            src={getChampionIcon(searchedPlayerStats.championName)} 
                                            width="48" 
                                            height="48" 
                                            className="rounded-full size-10 md:size-12"
                                            style={{color: 'transparent',}}
                                            alt = {searchedPlayerStats.championName}
                                        >
                                        </img>
                                        <span className="absolute bottom-0 right-0 flex items-center justify-center rounded-full bg-[var(--color-gray-900)] text-[11px] leading-[14px] text-white size-4 md:size-5">
                                            {searchedPlayerStats.champLevel}
                                        </span>
                                    </a>
                                    <div className="flex gap-0.5">
                                        <div className="flex flex-col gap-0.5">
                                            <img  
                                                width="22" 
                                                height="22" 
                                                className="rounded size-[18px] md:size-[22px]" 
                                                src={getSummonerSpellIcon(searchedPlayerStats.summonerSpell1)}
                                                style={{color: 'transparent'}}
                                            >
                                            </img>
                                            <img  
                                                width="22" 
                                                height="22" 
                                                className="rounded size-[18px] md:size-[22px]" 
                                                src={getSummonerSpellIcon(searchedPlayerStats.summonerSpell2)}
                                                style={{color: 'transparent'}}
                                            >
                                            </img>
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <img 
                                                width="22"
                                                height="22" 
                                                className="rounded-full size-[18px] md:size-[22px]" 
                                                src={getKeystoneIcon(searchedPlayerStats.keystoneRune)}
                                                style={{color: 'transparent'}}
                                            ></img>
                                            <img 
                                                width="22"
                                                height="22" 
                                                className="rounded-full size-[18px] md:size-[22px]" 
                                                src={getSecondaryTreeIcon(searchedPlayerStats.secondaryTree)} 
                                                style={{color: 'transparent'}}
                                            ></img>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-1 flex-col items-center gap-0.5 md:max-w-[114px] md:items-start">
                                    <div className="flex items-center gap-1 text-[15px] leading-[22px]">
                                        <strong className="text-gray-900">{searchedPlayerStats.kills}</strong>
                                        /
                                        <strong className="text-red-600">{searchedPlayerStats.deaths}</strong>
                                        /
                                        <strong className="text-gray-900">{searchedPlayerStats.assists}</strong>
                                    </div>
                                    <div className="text-gray-500">
                                        {kdaCheck(searchedPlayerStats.kda)}
                                    </div>
                                </div>
                                <div className="flex flex-1 flex-col items-center whitespace-nowrap text-2xs leading-[14px] max-[320px]:hidden md:min-h-[58px] md:w-[131px] md:items-baseline md:border-l md:border-[var(--game-item-color-200)] md:pl-2">
                                    <div>P/Kill {searchedPlayerStats.killParticipation}%</div>
                                    <div>CS {searchedPlayerStats.cs} ({searchedPlayerStats.csPerMin})</div>
                                </div>

                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5 md:min-w-[253px] flex-row">
                                    <div className="grid grid-cols-4 items-center gap-0.5 md:grid-cols-7">
                                        <img 
                                            width="32" 
                                            height="32" 
                                            className="size-[18px] md:size-[22px] rounded" 
                                            src={getItemIcon(searchedPlayerStats.item0)}
                                            style={{color: 'transparent'}}
                                        > 
                                        </img>
                                        <img 
                                            width="32" 
                                            height="32" 
                                            className="size-[18px] md:size-[22px] rounded" 
                                            src={getItemIcon(searchedPlayerStats.item1)}
                                            style={{color: 'transparent'}}
                                        > 
                                        </img>
                                        <img 
                                            width="32" 
                                            height="32" 
                                            className="size-[18px] md:size-[22px] rounded" 
                                            src={getItemIcon(searchedPlayerStats.item2)}
                                            style={{color: 'transparent'}}
                                        > 
                                        </img>
                                        <img 
                                            width="32" 
                                            height="32" 
                                            className="size-[18px] md:size-[22px] rounded" 
                                            src={getItemIcon(searchedPlayerStats.item3)}
                                            style={{color: 'transparent'}}
                                        > 
                                        </img>
                                        <img 
                                            width="32" 
                                            height="32" 
                                            className="size-[18px] md:size-[22px] rounded" 
                                            src={getItemIcon(searchedPlayerStats.item4)}
                                            style={{color: 'transparent'}}
                                        > 
                                        </img>
                                        <img 
                                            width="32" 
                                            height="32" 
                                            className="size-[18px] md:size-[22px] rounded" 
                                            src={getItemIcon(searchedPlayerStats.item5)}
                                            style={{color: 'transparent'}}
                                        > 
                                        </img>
                                        <img 
                                            width="32" 
                                            height="32"
                                            className="size-[18px] md:size-[22px] rounded-full" 
                                            src={getItemIcon(searchedPlayerStats.wardItem)}
                                            style={{color: 'transparent'}}
                                        > 
                                        </img>
                                    </div>
                                    {searchedPlayerStats.multikill != "None" && (
                                        <div className="hidden overflow-x-auto scrollbar-none md:flex">
                                            <div className="flex h-5 gap-1 leading-5">
                                                <span className="flex px-2 whitespace-nowrap items-center text-white rounded-2xl h-5 box-border bg-gray-500">
                                                    {searchedPlayerStats.multikill}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="hidden gap-1 md:flex">
                            <div className="flex flex-col gap-0.5">
                                {/* Loop through blueTeam participants and display champ and name */}
                                {matchInfo.blueTeam.participants.map((participant: any, index: number) => (
                                    <div key={index} className="flex items-center gap-1">
                                        <img 
                                            width="16" 
                                            height="16"
                                            className="rounded-[4px]" 
                                            src={getChampionIcon(participant.championName)} 
                                            style={{color: 'transparent'}}
                                        >
                                        </img>
                                        <div className="flex w-[60px] items-center gap-1">
                                            <span className="cursor-pointer truncate ">
                                                {participant.summonerName}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col gap-0.5">
                                {/* Loop through redTeam participants and display champ and name */}
                                {matchInfo.redTeam.participants.map((participant: any, index: number) => (
                                    <div key={index} className="flex items-center gap-1">
                                        <img 
                                            width="16" 
                                            height="16"
                                            className="rounded-[4px]" 
                                            src={getChampionIcon(participant.championName)} 
                                            style={{color: 'transparent'}}
                                        >
                                        </img>
                                        <div className="flex w-[60px] items-center gap-1">
                                            <span className="cursor-pointer truncate ">
                                                {participant.summonerName}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative hidden md:flex md:basis-10 md:flex-col">
                <button 
                    className="flex flex-1 flex-col items-center justify-end p-2 bg-[var(--game-item-color-200)] hover:bg-[var(--game-item-color-300)] dark:hover:bg-[var(--game-item-color-100)]" 
                    type="button"
                    onClick={toggleVisibility}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="transition-transform duration-150 ease-out text-[var(--game-item-color-500)]"><path fill="currentColor" fillRule="nonzero" d="M12 13.2 16.5 9l1.5 1.4-6 5.6-6-5.6L7.5 9z"></path></svg>
                </button>
            </div>
          </div>
          {/* Conditionally render the next div */}
          {isVisible && (
            <div className="space-y-2">
                <div className="mt-[-4px]">
                    <div>
                        <div className="flex flex-col">
                            <div className="overflow-x-auto">
                                <table className="table-fixed [&_caption]:hidden [&_tbody_tr:not(.ad)]:border-b [&_tbody_tr:not(.ad)]:border-b-gray-200 [&_tbody_tr:not(.ad):last-of-type]:border-0 [&_th]:font-normal [&_th]:box-border [&_th]:align-middle [&_tr:not(.ad)_th:first-of-type]:pl-3 [&_tr:not(.ad)_th:last-of-type]:pr-3 [&_td]:font-normal [&_td]:box-border [&_td]:align-middle [&_tr:not(.ad)_td]:p-1 [&_tr:not(.ad)_td:first-of-type]:pl-3 [&_tr:not(.ad)_td:last-of-type]:pr-3 [&_thead_th]:bg-gray-100 [&_thead_th]:h-8 [&_thead_th]:box-border [&_thead_th]:text-gray-400 [&_thead_th]:text-xs [&_thead_th]:whitespace-nowrap [&_thead_th]:p-0 [&_thead_th]:border-b [&_thead_th:not(.table-sort)]:border-gray-200 [&_tbody_th:not(.bg-gray-100)]:bg-gray-0 [&_tbody_tr:not(.ad)_td:not(.bg-gray-100)]:bg-gray-0 [&_tbody_tr:last-of-type_th]:border-0 [&_tbody_tr:last-of-type_td]:border-0 md:table-hover md:[&(.table-hover)_tbody_tr:hover_th]:bg-gray-100 md:[&(.table-hover)_tbody_tr:not(.ad):hover_td:not(.bg-gray-100)]:bg-gray-100 table-hover [&(.table-hover)_tbody_tr:hover_th]:bg-gray-100 [&(.table-hover)_tbody_tr:not(.ad):hover_td:not(.bg-gray-100)]:bg-gray-100 table-rounded [&(.table-rounded)_thead_th:first-of-type]:rounded-tl-sm [&(.table-rounded)_thead_th:last-of-type]:rounded-tr-sm [&(.table-rounded)_tbody_tr:last-of-type_td:first-of-type]:rounded-bl-sm [&(.table-rounded)_tbody_tr:last-of-type_td:last-of-type]:rounded-br-sm w-full min-w-[740px] text-[11px] text-gray-500">
                                    <colgroup>
                                        <col className="w-auto"/>
                                        <col className="w-[68px]"/>
                                        <col className="w-[120px]"/>
                                        <col className="w-[48px]"/>
                                        <col className="w-[56px]"/>
                                        <col className="w-[175px]"/>
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th scope="col" className="!bg-gray-0 text-left">
                                                <span className="mr-[4px] font-bold text-main-500">{getWin(matchInfo.blueTeam)}</span>(Blue Team)
                                            </th>
                                            <th scope="col" className="!bg-gray-0">KDA</th>
                                            <th scope="col" className="!bg-gray-0">Damage</th>
                                            <th scope="col" className="!bg-gray-0">Wards</th>
                                            <th scope="col" className="!bg-gray-0">CS</th>
                                            <th scope="col" className="!bg-gray-0">Items</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {matchInfo.blueTeam.participants.map((participant: any, index: number) => (
                                            <tr className="!border-b-0" key={index}>
                                                <td className="!bg-main-100">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center gap-1">
                                                            <div className="relative shrink-0">
                                                                <img
                                                                    width="48" 
                                                                    height="48" 
                                                                    className="rounded-full size-8"
                                                                    src={getChampionIcon(participant.championName)} 
                                                                    style={{color: 'transparent'}}/>
                                                                <span className="absolute bottom-0 right-0 flex items-center justify-center rounded-full bg-[var(--color-gray-900)] text-[11px] leading-[14px] text-white size-[15px]">
                                                                    {participant.champLevel}
                                                                </span>
                                                            </div>
                                                            <div className="flex gap-0.5">
                                                                <div className="flex flex-col gap-0.5">
                                                                    <div className="size-4">
                                                                        <img 
                                                                            width="22" 
                                                                            height="22"
                                                                            className="rounded size-4" 
                                                                            src={getSummonerSpellIcon(participant.summonerSpell1)} 
                                                                            style={{color: 'transparent'}}
                                                                        />
                                                                    </div>
                                                                    <div className="size-4">
                                                                        <img 
                                                                            width="22" 
                                                                            height="22"
                                                                            className="rounded size-4" 
                                                                            src={getSummonerSpellIcon(participant.summonerSpell2)} 
                                                                            style={{color: 'transparent'}}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-col gap-0.5">
                                                                <div className="size-4">
                                                                        <img 
                                                                            width="22" 
                                                                            height="22"
                                                                            className="rounded size-4" 
                                                                            src={getKeystoneIcon(participant.keystoneRune)} 
                                                                            style={{color: 'transparent'}}
                                                                        />
                                                                    </div>
                                                                    <div className="size-4">
                                                                        <img 
                                                                            width="22" 
                                                                            height="22"
                                                                            className="rounded size-4" 
                                                                            src={getSecondaryTreeIcon(participant.secondaryTree)} 
                                                                            style={{color: 'transparent'}}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex max-w-[90px] flex-col">
                                                            <div className="flex max-w-[80px] items-center gap-1">
                                                                <a className="flex-1 cursor-pointer text-[12px] leading-[16px] text-gray-900">
                                                                    {participant.summonerName}
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="!bg-main-100">
                                                    <span className="inline-block w-full text-center leading-[14px]">
                                                        {participant.kills}
                                                        /
                                                        {participant.deaths}
                                                        /
                                                        {participant.assists} ({participant.killParticipation}%)
                                                    </span>
                                                </td>
                                                <td className="!bg-main-100">
                                                    <div className="flex items-center gap-1">
                                                        <div>
                                                            <div className="text-center">{participant.damageDealt}</div>
                                                            <div className="relative h-5 bg-gray-0 h-[6px] w-[50px]">
                                                                <div className="absolute bottom-0 left-0 h-full bg-red-500 transition-all duration-300" style={{width: "100%", height: "100%"}}></div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-center">{participant.damageTaken}</div>
                                                            <div className="relative h-5 bg-gray-0 h-[6px] w-[50px]">
                                                                <div className="absolute bottom-0 left-0 h-full bg-gray-400 transition-all duration-300" style={{width: "100%", height: "100%"}}></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="!bg-main-100">
                                                    <div className="flex flex-col items-center">
                                                        <div className="text-center leading-[14px]">
                                                            {participant.pinkWards}
                                                        </div>
                                                        <div className="text-center leading-[14px]">
                                                            {participant.wardsPlaced} / {participant.wardsKilled}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="!bg-main-100">
                                                    <div className="flex flex-col items-center">
                                                        <div className="text-center leading-[14px]">
                                                            {participant.cs}
                                                        </div>
                                                        <div className="text-center leading-[14px]">
                                                            {participant.csPerMin}/m
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="!bg-main-100 [--game-item-color-100:theme(colors.main.100)] [--game-item-color-200:theme(colors.main.200)] [--game-item-color-300:theme(colors.main.300)] [--game-item-color-500:theme(colors.main.500)] [--game-item-color-600:theme(colors.main.600)] [--game-item-color-200-dark:theme(colors.main.300)]">
                                                    <div className="grid grid-cols-4 items-center gap-0.5 md:grid-cols-7 !grid-cols-7">
                                                        <div className="size-[18px] bg-[var(--game-item-color-300)] md:size-[22px] rounded">
                                                            <img
                                                                width="32" 
                                                                height="32"
                                                                className="size-[18px] md:size-[22px] rounded" 
                                                                src={getItemIcon(participant.item0)} 
                                                                style={{color: 'transparent'}}
                                                            />
                                                        </div>
                                                        <div className="size-[18px] bg-[var(--game-item-color-300)] md:size-[22px] rounded">
                                                            <img
                                                                width="32" 
                                                                height="32"
                                                                className="size-[18px] md:size-[22px] rounded" 
                                                                src={getItemIcon(participant.item1)} 
                                                                style={{color: 'transparent'}}
                                                            />
                                                        </div>
                                                        <div className="size-[18px] bg-[var(--game-item-color-300)] md:size-[22px] rounded">
                                                            <img
                                                                width="32" 
                                                                height="32"
                                                                className="size-[18px] md:size-[22px] rounded" 
                                                                src={getItemIcon(participant.item2)} 
                                                                style={{color: 'transparent'}}
                                                            />
                                                        </div>
                                                        <div className="size-[18px] bg-[var(--game-item-color-300)] md:size-[22px] rounded">
                                                            <img
                                                                width="32" 
                                                                height="32"
                                                                className="size-[18px] md:size-[22px] rounded" 
                                                                src={getItemIcon(participant.item3)} 
                                                                style={{color: 'transparent'}}
                                                            />
                                                        </div>
                                                        <div className="size-[18px] bg-[var(--game-item-color-300)] md:size-[22px] rounded">
                                                            <img
                                                                width="32" 
                                                                height="32"
                                                                className="size-[18px] md:size-[22px] rounded" 
                                                                src={getItemIcon(participant.item4)} 
                                                                style={{color: 'transparent'}}
                                                            />
                                                        </div>
                                                        <div className="size-[18px] bg-[var(--game-item-color-300)] md:size-[22px] rounded">
                                                            <img
                                                                width="32" 
                                                                height="32"
                                                                className="size-[18px] md:size-[22px] rounded" 
                                                                src={getItemIcon(participant.item5)} 
                                                                style={{color: 'transparent'}}
                                                            />
                                                        </div>
                                                        <div className="size-[18px] bg-[var(--game-item-color-300)] md:size-[22px] row-start-1 rounded-full md:col-auto md:row-auto col-start-7">
                                                            <img
                                                                width="32" 
                                                                height="32"
                                                                className="size-[18px] md:size-[22px] rounded-full" 
                                                                src={getItemIcon(participant.wardItem)} 
                                                                style={{color: 'transparent'}}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr> 
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex flex-col items-center justify-between border-y border-gray-200 bg-gray-100 px-4 py-2 md:flex-row">
                                <div className="flex gap-x-1 md:max-w-[150px] md:flex-wrap">
                                    <div className="flex content-center gap-1 text-[12px] text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" className="text-main-500"><path fill="blue" fillRule="nonzero" d="M9 10a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7 8a1 1 0 1 1 2 0 1 1 0 0 1-2 0m0 4a1 1 0 1 1 2 0 1 1 0 0 1-2 0m-2-2a1 1 0 1 1 2 0 1 1 0 0 1-2 0m5-10 2 4-1 1H9L8 4 7 5H5L4 4l2-4-6 4 2 4 3 8 1-1h4l1 1 3-8 2-4z"></path></svg>
                                        <span className="min-w-[14px] text-center">{matchInfo.blueTeam.stats.barons}</span>
                                    </div>
                                    <div className="flex content-center gap-1 text-[12px] text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16" className="text-main-500"><path fill="blue" fillRule="evenodd" d="M8 0 6 4 3 1v4H0l3 3v3l4 5h2l4-5V8l3-3h-3V1l-3 3zm1 11 1-2 2-1-1 2zM4 8l1 2 2 1-1-2z" clipRule="evenodd"></path><mask id="mask0_5762_288546" width="16" height="16" x="0" y="0" maskUnits="userSpaceOnUse"><path fill="#fff" fillRule="evenodd" d="M8 0 6 4 3 1v4H0l3 3v3l4 5h2l4-5V8l3-3h-3V1l-3 3zm1 11 1-2 2-1-1 2zM4 8l1 2 2 1-1-2z" clipRule="evenodd"></path></mask></svg>
                                        <span className="min-w-[14px] text-center">{matchInfo.blueTeam.stats.dragons}</span>
                                    </div>
                                    <div className="flex content-center gap-1 text-[12px] text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" className="text-main-500"><g id="OPGGDesignGuide" fill="none" fillRule="evenodd" stroke="none" strokeWidth="1"><g id="GUIDE_03Icon" fill="blue" fillRule="nonzero" transform="translate(-1668 -1020)"><g id="01-Icon-/-01-lol-/-icon_Herald" transform="translate(1668 1020.167)"><path id="Combined-Shape" d="M14.286 11.387c1.219.552 1.714 1.599 1.714 1.599-1.155 2.232-2.581 2.351-2.755 2.357h-.018c.345-.39 1.059-3.956 1.059-3.956m-12.572 0s.713 3.565 1.058 3.956c0 0-1.541.023-2.772-2.357 0 0 .494-1.047 1.714-1.6M11.238 1s4.44 2.576 3.75 7.845c0 0-2.048.345-2.163 1.886 0 0-.85 3.382-4.762 3.52H7.93c-3.91-.138-4.762-3.52-4.762-3.52-.115-1.541-2.163-1.886-2.163-1.886C.314 3.576 4.754 1 4.754 1c-1.157 3.41.03 4.182.152 4.25l.01.006c1.09-.805 2.125-1.095 3.032-1.12q.024-.004.048-.002l.048-.002c.907.029 1.942.319 3.033 1.124 0 0 1.38-.667.16-4.256m-.127 7.638c.023-2.83-3.04-2.588-3.163-2.578-.123-.01-3.186-.252-3.163 2.578 0 0 .023 3.393 3.094 3.68h.138c3.07-.287 3.094-3.68 3.094-3.68M7.993 7.073c.571 0 1.034.94 1.034 2.102 0 1.16-.463 2.1-1.034 2.1-.57 0-1.034-.94-1.034-2.1s.463-2.102 1.034-2.102"></path></g></g></g></svg>
                                        <span className="min-w-[14px] text-center">{matchInfo.blueTeam.stats.riftHeralds}</span>
                                    </div>
                                    <div className="flex content-center gap-1 text-[12px] text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16" className="text-main-500"><g id="icon_atakhan"><g id="Union" fill="blue"><path d="M8 0 6.476 3.048l.508 2.54L8 7.11l1.016-1.524.508-2.54zM6.476 5.587l-.508-2.031-2.031-1.524v2.031L2.413 5.587v1.016h1.016L4.952 5.08z"></path><path fillRule="evenodd" d="M4.444 6.095 8 8.127l3.556-2.032 1.015 1.016.508 1.524.508-1.524L16 6.603l-3.429 6.095-1.015 2.54-1.016-1.016v-1.524l-1.524 1.016H6.984L5.46 12.698v1.524l-1.016 1.016-1.015-2.54L0 6.603l2.413.508.508 1.524.508-1.524zm2.032 3.556.508 1.524-2.032-1.016-.508-1.524zm3.048 0-.508 1.524 2.032-1.016.508-1.524z" clipRule="evenodd"></path><path d="m9.524 5.587.508-2.031 2.031-1.524v2.031l1.524 1.524v1.016h-1.016L11.048 5.08z"></path></g></g></svg>
                                        <span className="min-w-[14px] text-center">{matchInfo.blueTeam.stats.atakhan}</span>
                                    </div>
                                    <div className="flex content-center gap-1 text-[12px] text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16" className="text-main-500"><path fill="blue" fillRule="evenodd" d="M8 1 6.333 2.42s-.87.798-1.151.798H3.928c-.928 0-2.261.978-2.557 2.68-.074.429-.098 1.282.56 2.168L1 8.812s1.333.71 1.667 2.131C3 12.363 5.088 13.704 6.9 14.088l1.08.881V15L8 14.985l.019.015v-.031l1.08-.881c1.813-.384 3.901-1.724 4.234-3.145.334-1.42 1.667-2.13 1.667-2.13l-.931-.747c.658-.886.637-1.726.56-2.169-.296-1.701-1.629-2.68-2.557-2.68h-1.254c-.28 0-1.151-.797-1.151-.797zm.149 3.245a.2.2 0 0 0-.298 0L5.434 6.93a.2.2 0 0 0 .021.29c.275.228.818.687 1.007.914.21.255-1.316 1.405-1.862 1.804a.202.202 0 0 0-.026.304l1.84 1.88a.2.2 0 0 0 .285 0l1.158-1.183a.2.2 0 0 1 .286 0L9.3 12.122a.2.2 0 0 0 .286 0l1.84-1.88a.202.202 0 0 0-.026-.304c-.546-.399-2.073-1.549-1.862-1.804.189-.227.732-.686 1.007-.913a.2.2 0 0 0 .021-.29z" clipRule="evenodd"></path></svg>
                                        <span className="min-w-[14px] text-center">{matchInfo.blueTeam.stats.voidGrubs}</span>
                                    </div>
                                    <div className="flex content-center gap-1 text-[12px] text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" className="text-main-500"><path fill="blue" fillRule="nonzero" d="m12 8-2 8H6L4 8l4 4zM8 0l4 4-1.003 1.002L11 5h3l-6 6-6-6h2.999L4 4zm0 2.4L6.4 4 8 5.6 9.6 4z"></path></svg>
                                        <span className="min-w-[14px] text-center">{matchInfo.blueTeam.stats.towers}</span>
                                    </div>
                                    <div className="flex content-center gap-1 text-[12px] text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16" className="text-main-500"><path fill="blue" fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14m0-1A6 6 0 1 0 8 2a6 6 0 0 0 0 12" clipRule="evenodd"></path><path fill="blue" d="m8 4 4 4-4 4-4-4z"></path></svg>
                                        <span className="min-w-[14px] text-center">{matchInfo.blueTeam.stats.inhibitors}</span>
                                    </div>
                                </div>
                                <div className="my-[6px] text-white md:m-0">
                                    <div className="relative m-auto w-[300px] md:w-[383px]">
                                        <div className="relative h-5 bg-gray-0 h-[16px] w-full text-[12px] !bg-red-500">
                                            <div className="absolute bottom-0 left-0 h-full bg-main-500 transition-all duration-300" style={{width: "60.4938%", height: "100%"}}></div>
                                        </div>
                                        <div className="absolute left-[8px] top-0 text-[12px] leading-[16px]">
                                            {matchInfo.blueTeam.stats.totalKills}
                                        </div>
                                        <div className="absolute left-1/2 top-0 -translate-x-1/2 transform text-[12px] leading-[16px]">
                                            Total Kill
                                        </div>
                                        <div className="absolute right-[8px] top-0 text-[12px] leading-[16px]">
                                            {matchInfo.redTeam.stats.totalKills}
                                        </div>
                                    </div>
                                    <div className="relative my-auto mt-1 w-[300px] md:w-[383px]">
                                        <div className="relative h-5 bg-gray-0 h-[16px] w-full text-[12px] !bg-red-500">
                                            <div className="absolute bottom-0 left-0 h-full bg-main-500 transition-all duration-300" style={{width: "53.3301%", height: "100%"}}>
                                            </div>
                                        </div>
                                        <div className="absolute left-[8px] top-0 h-[16px] text-[12px] leading-[16px]">
                                            {matchInfo.blueTeam.stats.totalGold}
                                        </div>
                                        <div className="absolute left-1/2 top-0 -translate-x-1/2 transform text-[12px] leading-[16px]">
                                            Total Gold
                                        </div>
                                        <div className="absolute right-[8px] top-0 text-[12px] leading-[16px]">
                                            {matchInfo.redTeam.stats.totalGold}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-x-1 md:max-w-[150px] md:flex-wrap justify-end">
                                <div className="flex content-center gap-1 text-[12px] text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" className="text-main-500"><path fill="red" fillRule="nonzero" d="M9 10a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7 8a1 1 0 1 1 2 0 1 1 0 0 1-2 0m0 4a1 1 0 1 1 2 0 1 1 0 0 1-2 0m-2-2a1 1 0 1 1 2 0 1 1 0 0 1-2 0m5-10 2 4-1 1H9L8 4 7 5H5L4 4l2-4-6 4 2 4 3 8 1-1h4l1 1 3-8 2-4z"></path></svg>
                                        <span className="min-w-[14px] text-center">{matchInfo.redTeam.stats.barons}</span>
                                    </div>
                                    <div className="flex content-center gap-1 text-[12px] text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16" className="text-main-500"><path fill="red" fillRule="evenodd" d="M8 0 6 4 3 1v4H0l3 3v3l4 5h2l4-5V8l3-3h-3V1l-3 3zm1 11 1-2 2-1-1 2zM4 8l1 2 2 1-1-2z" clipRule="evenodd"></path><mask id="mask0_5762_288546" width="16" height="16" x="0" y="0" maskUnits="userSpaceOnUse"><path fill="#fff" fillRule="evenodd" d="M8 0 6 4 3 1v4H0l3 3v3l4 5h2l4-5V8l3-3h-3V1l-3 3zm1 11 1-2 2-1-1 2zM4 8l1 2 2 1-1-2z" clipRule="evenodd"></path></mask></svg>
                                        <span className="min-w-[14px] text-center">{matchInfo.redTeam.stats.dragons}</span>
                                    </div>
                                    <div className="flex content-center gap-1 text-[12px] text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" className="text-main-500"><g id="OPGGDesignGuide" fill="none" fillRule="evenodd" stroke="none" strokeWidth="1"><g id="GUIDE_03Icon" fill="red" fillRule="nonzero" transform="translate(-1668 -1020)"><g id="01-Icon-/-01-lol-/-icon_Herald" transform="translate(1668 1020.167)"><path id="Combined-Shape" d="M14.286 11.387c1.219.552 1.714 1.599 1.714 1.599-1.155 2.232-2.581 2.351-2.755 2.357h-.018c.345-.39 1.059-3.956 1.059-3.956m-12.572 0s.713 3.565 1.058 3.956c0 0-1.541.023-2.772-2.357 0 0 .494-1.047 1.714-1.6M11.238 1s4.44 2.576 3.75 7.845c0 0-2.048.345-2.163 1.886 0 0-.85 3.382-4.762 3.52H7.93c-3.91-.138-4.762-3.52-4.762-3.52-.115-1.541-2.163-1.886-2.163-1.886C.314 3.576 4.754 1 4.754 1c-1.157 3.41.03 4.182.152 4.25l.01.006c1.09-.805 2.125-1.095 3.032-1.12q.024-.004.048-.002l.048-.002c.907.029 1.942.319 3.033 1.124 0 0 1.38-.667.16-4.256m-.127 7.638c.023-2.83-3.04-2.588-3.163-2.578-.123-.01-3.186-.252-3.163 2.578 0 0 .023 3.393 3.094 3.68h.138c3.07-.287 3.094-3.68 3.094-3.68M7.993 7.073c.571 0 1.034.94 1.034 2.102 0 1.16-.463 2.1-1.034 2.1-.57 0-1.034-.94-1.034-2.1s.463-2.102 1.034-2.102"></path></g></g></g></svg>
                                        <span className="min-w-[14px] text-center">{matchInfo.redTeam.stats.riftHeralds}</span>
                                    </div>
                                    <div className="flex content-center gap-1 text-[12px] text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16" className="text-main-500"><g id="icon_atakhan"><g id="Union" fill="red"><path d="M8 0 6.476 3.048l.508 2.54L8 7.11l1.016-1.524.508-2.54zM6.476 5.587l-.508-2.031-2.031-1.524v2.031L2.413 5.587v1.016h1.016L4.952 5.08z"></path><path fillRule="evenodd" d="M4.444 6.095 8 8.127l3.556-2.032 1.015 1.016.508 1.524.508-1.524L16 6.603l-3.429 6.095-1.015 2.54-1.016-1.016v-1.524l-1.524 1.016H6.984L5.46 12.698v1.524l-1.016 1.016-1.015-2.54L0 6.603l2.413.508.508 1.524.508-1.524zm2.032 3.556.508 1.524-2.032-1.016-.508-1.524zm3.048 0-.508 1.524 2.032-1.016.508-1.524z" clipRule="evenodd"></path><path d="m9.524 5.587.508-2.031 2.031-1.524v2.031l1.524 1.524v1.016h-1.016L11.048 5.08z"></path></g></g></svg>
                                        <span className="min-w-[14px] text-center">{matchInfo.redTeam.stats.atakhan}</span>
                                    </div>
                                    <div className="flex content-center gap-1 text-[12px] text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16" className="text-main-500"><path fill="red" fillRule="evenodd" d="M8 1 6.333 2.42s-.87.798-1.151.798H3.928c-.928 0-2.261.978-2.557 2.68-.074.429-.098 1.282.56 2.168L1 8.812s1.333.71 1.667 2.131C3 12.363 5.088 13.704 6.9 14.088l1.08.881V15L8 14.985l.019.015v-.031l1.08-.881c1.813-.384 3.901-1.724 4.234-3.145.334-1.42 1.667-2.13 1.667-2.13l-.931-.747c.658-.886.637-1.726.56-2.169-.296-1.701-1.629-2.68-2.557-2.68h-1.254c-.28 0-1.151-.797-1.151-.797zm.149 3.245a.2.2 0 0 0-.298 0L5.434 6.93a.2.2 0 0 0 .021.29c.275.228.818.687 1.007.914.21.255-1.316 1.405-1.862 1.804a.202.202 0 0 0-.026.304l1.84 1.88a.2.2 0 0 0 .285 0l1.158-1.183a.2.2 0 0 1 .286 0L9.3 12.122a.2.2 0 0 0 .286 0l1.84-1.88a.202.202 0 0 0-.026-.304c-.546-.399-2.073-1.549-1.862-1.804.189-.227.732-.686 1.007-.913a.2.2 0 0 0 .021-.29z" clipRule="evenodd"></path></svg>
                                        <span className="min-w-[14px] text-center">{matchInfo.redTeam.stats.voidGrubs}</span>
                                    </div>
                                    <div className="flex content-center gap-1 text-[12px] text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" className="text-main-500"><path fill="red" fillRule="nonzero" d="m12 8-2 8H6L4 8l4 4zM8 0l4 4-1.003 1.002L11 5h3l-6 6-6-6h2.999L4 4zm0 2.4L6.4 4 8 5.6 9.6 4z"></path></svg>
                                        <span className="min-w-[14px] text-center">{matchInfo.redTeam.stats.towers}</span>
                                    </div>
                                    <div className="flex content-center gap-1 text-[12px] text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16" className="text-main-500"><path fill="red" fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14m0-1A6 6 0 1 0 8 2a6 6 0 0 0 0 12" clipRule="evenodd"></path><path fill="red" d="m8 4 4 4-4 4-4-4z"></path></svg>
                                        <span className="min-w-[14px] text-center">{matchInfo.redTeam.stats.inhibitors}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="table-fixed [&_caption]:hidden [&_tbody_tr:not(.ad)]:border-b [&_tbody_tr:not(.ad)]:border-b-gray-200 [&_tbody_tr:not(.ad):last-of-type]:border-0 [&_th]:font-normal [&_th]:box-border [&_th]:align-middle [&_tr:not(.ad)_th:first-of-type]:pl-3 [&_tr:not(.ad)_th:last-of-type]:pr-3 [&_td]:font-normal [&_td]:box-border [&_td]:align-middle [&_tr:not(.ad)_td]:p-1 [&_tr:not(.ad)_td:first-of-type]:pl-3 [&_tr:not(.ad)_td:last-of-type]:pr-3 [&_thead_th]:bg-gray-100 [&_thead_th]:h-8 [&_thead_th]:box-border [&_thead_th]:text-gray-400 [&_thead_th]:text-xs [&_thead_th]:whitespace-nowrap [&_thead_th]:p-0 [&_thead_th]:border-b [&_thead_th:not(.table-sort)]:border-gray-200 [&_tbody_th:not(.bg-gray-100)]:bg-gray-0 [&_tbody_tr:not(.ad)_td:not(.bg-gray-100)]:bg-gray-0 [&_tbody_tr:last-of-type_th]:border-0 [&_tbody_tr:last-of-type_td]:border-0 md:table-hover md:[&(.table-hover)_tbody_tr:hover_th]:bg-gray-100 md:[&(.table-hover)_tbody_tr:not(.ad):hover_td:not(.bg-gray-100)]:bg-gray-100 table-hover [&(.table-hover)_tbody_tr:hover_th]:bg-gray-100 [&(.table-hover)_tbody_tr:not(.ad):hover_td:not(.bg-gray-100)]:bg-gray-100 table-rounded [&(.table-rounded)_thead_th:first-of-type]:rounded-tl-sm [&(.table-rounded)_thead_th:last-of-type]:rounded-tr-sm [&(.table-rounded)_tbody_tr:last-of-type_td:first-of-type]:rounded-bl-sm [&(.table-rounded)_tbody_tr:last-of-type_td:last-of-type]:rounded-br-sm w-full min-w-[740px] text-[11px] text-gray-500">
                                    <colgroup>
                                        <col className="w-auto"/>
                                        <col className="w-[68px]"/>
                                        <col className="w-[120px]"/>
                                        <col className="w-[48px]"/>
                                        <col className="w-[56px]"/>
                                        <col className="w-[175px]"/>
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th scope="col" className="!bg-gray-0 text-left">
                                                <span className="mr-[4px] font-bold text-main-500">{getWin(matchInfo.redTeam)}</span>(Red Team)
                                            </th>
                                            <th scope="col" className="!bg-gray-0">KDA</th>
                                            <th scope="col" className="!bg-gray-0">Damage</th>
                                            <th scope="col" className="!bg-gray-0">Wards</th>
                                            <th scope="col" className="!bg-gray-0">CS</th>
                                            <th scope="col" className="!bg-gray-0">Items</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {matchInfo.redTeam.participants.map((participant: any, index: number) => (
                                            <tr className="!border-b-0" key={index}>
                                                <td className="!bg-main-100">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center gap-1">
                                                            <div className="relative shrink-0">
                                                                <img
                                                                    width="48" 
                                                                    height="48" 
                                                                    className="rounded-full size-8"
                                                                    src={getChampionIcon(participant.championName)} 
                                                                    style={{color: 'transparent'}}/>
                                                                <span className="absolute bottom-0 right-0 flex items-center justify-center rounded-full bg-[var(--color-gray-900)] text-[11px] leading-[14px] text-white size-[15px]">
                                                                    {participant.champLevel}
                                                                </span>
                                                            </div>
                                                            <div className="flex gap-0.5">
                                                                <div className="flex flex-col gap-0.5">
                                                                    <div className="size-4">
                                                                        <img 
                                                                            width="22" 
                                                                            height="22"
                                                                            className="rounded size-4" 
                                                                            src={getSummonerSpellIcon(participant.summonerSpell1)} 
                                                                            style={{color: 'transparent'}}
                                                                        />
                                                                    </div>
                                                                    <div className="size-4">
                                                                        <img 
                                                                            width="22" 
                                                                            height="22"
                                                                            className="rounded size-4" 
                                                                            src={getSummonerSpellIcon(participant.summonerSpell2)} 
                                                                            style={{color: 'transparent'}}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-col gap-0.5">
                                                                <div className="size-4">
                                                                        <img 
                                                                            width="22" 
                                                                            height="22"
                                                                            className="rounded size-4" 
                                                                            src={getKeystoneIcon(participant.keystoneRune)} 
                                                                            style={{color: 'transparent'}}
                                                                        />
                                                                    </div>
                                                                    <div className="size-4">
                                                                        <img 
                                                                            width="22" 
                                                                            height="22"
                                                                            className="rounded size-4" 
                                                                            src={getSecondaryTreeIcon(participant.secondaryTree)} 
                                                                            style={{color: 'transparent'}}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex max-w-[90px] flex-col">
                                                            <div className="flex max-w-[80px] items-center gap-1">
                                                                <a className="flex-1 cursor-pointer text-[12px] leading-[16px] text-gray-900">
                                                                    {participant.summonerName}
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="!bg-main-100">
                                                    <span className="inline-block w-full text-center leading-[14px]">
                                                        {participant.kills}
                                                        /
                                                        {participant.deaths}
                                                        /
                                                        {participant.assists} ({participant.killParticipation}%)
                                                    </span>
                                                </td>
                                                <td className="!bg-main-100">
                                                    <div className="flex items-center gap-1">
                                                        <div>
                                                            <div className="text-center">{participant.damageDealt}</div>
                                                            <div className="relative h-5 bg-gray-0 h-[6px] w-[50px]">
                                                                <div className="absolute bottom-0 left-0 h-full bg-red-500 transition-all duration-300" style={{width: "100%", height: "100%"}}></div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-center">{participant.damageTaken}</div>
                                                            <div className="relative h-5 bg-gray-0 h-[6px] w-[50px]">
                                                                <div className="absolute bottom-0 left-0 h-full bg-gray-400 transition-all duration-300" style={{width: "100%", height: "100%"}}></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="!bg-main-100">
                                                    <div className="flex flex-col items-center">
                                                        <div className="text-center leading-[14px]">
                                                            {participant.pinkWards}
                                                        </div>
                                                        <div className="text-center leading-[14px]">
                                                            {participant.wardsPlaced} / {participant.wardsKilled}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="!bg-main-100">
                                                    <div className="flex flex-col items-center">
                                                        <div className="text-center leading-[14px]">
                                                            {participant.cs}
                                                        </div>
                                                        <div className="text-center leading-[14px]">
                                                            {participant.csPerMin}/m
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="!bg-main-100 [--game-item-color-100:theme(colors.main.100)] [--game-item-color-200:theme(colors.main.200)] [--game-item-color-300:theme(colors.main.300)] [--game-item-color-500:theme(colors.main.500)] [--game-item-color-600:theme(colors.main.600)] [--game-item-color-200-dark:theme(colors.main.300)]">
                                                    <div className="grid grid-cols-4 items-center gap-0.5 md:grid-cols-7 !grid-cols-7">
                                                        <div className="size-[18px] bg-[var(--game-item-color-300)] md:size-[22px] rounded">
                                                            <img
                                                                width="32" 
                                                                height="32"
                                                                className="size-[18px] md:size-[22px] rounded" 
                                                                src={getItemIcon(participant.item0)} 
                                                                style={{color: 'transparent'}}
                                                            />
                                                        </div>
                                                        <div className="size-[18px] bg-[var(--game-item-color-300)] md:size-[22px] rounded">
                                                            <img
                                                                width="32" 
                                                                height="32"
                                                                className="size-[18px] md:size-[22px] rounded" 
                                                                src={getItemIcon(participant.item1)} 
                                                                style={{color: 'transparent'}}
                                                            />
                                                        </div>
                                                        <div className="size-[18px] bg-[var(--game-item-color-300)] md:size-[22px] rounded">
                                                            <img
                                                                width="32" 
                                                                height="32"
                                                                className="size-[18px] md:size-[22px] rounded" 
                                                                src={getItemIcon(participant.item2)} 
                                                                style={{color: 'transparent'}}
                                                            />
                                                        </div>
                                                        <div className="size-[18px] bg-[var(--game-item-color-300)] md:size-[22px] rounded">
                                                            <img
                                                                width="32" 
                                                                height="32"
                                                                className="size-[18px] md:size-[22px] rounded" 
                                                                src={getItemIcon(participant.item3)} 
                                                                style={{color: 'transparent'}}
                                                            />
                                                        </div>
                                                        <div className="size-[18px] bg-[var(--game-item-color-300)] md:size-[22px] rounded">
                                                            <img
                                                                width="32" 
                                                                height="32"
                                                                className="size-[18px] md:size-[22px] rounded" 
                                                                src={getItemIcon(participant.item4)} 
                                                                style={{color: 'transparent'}}
                                                            />
                                                        </div>
                                                        <div className="size-[18px] bg-[var(--game-item-color-300)] md:size-[22px] rounded">
                                                            <img
                                                                width="32" 
                                                                height="32"
                                                                className="size-[18px] md:size-[22px] rounded" 
                                                                src={getItemIcon(participant.item5)} 
                                                                style={{color: 'transparent'}}
                                                            />
                                                        </div>
                                                        <div className="size-[18px] bg-[var(--game-item-color-300)] md:size-[22px] row-start-1 rounded-full md:col-auto md:row-auto col-start-7">
                                                            <img
                                                                width="32" 
                                                                height="32"
                                                                className="size-[18px] md:size-[22px] rounded-full" 
                                                                src={getItemIcon(participant.wardItem)} 
                                                                style={{color: 'transparent'}}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr> 
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          )}
        </div>
      );
  };
  
  export default MatchDisplay;