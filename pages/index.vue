<template>
    <v-app>
        <v-app-bar :title="`Toontown Rewritten Race Tracker`" :color="`#1a5493`">
        </v-app-bar>
        <v-main>
            <v-container>
                <v-row class="ga-4 my-4">
                    <v-select class="w-25" :label="`District`" :items="districtItems"
                        v-model:model-value='selectedDistrict' @update:model-value="setRaceTypeItems()">
                    </v-select>
                    <v-select class="w-25" :label="`Race type`" :disabled="raceTypeDisabled" :items="raceTypeItems"
                        v-model:model-value='selectedRaceType' @update:model-value="setLeaderboardByDistrict()">
                    </v-select>
                </v-row>
                <RaceLeaderboardByDistrict :race-leaderboard-by-district-items="raceLeaderboardByDistrictItems"
                    :race-leaderboard-by-district-show="raceLeaderboardByDistrictShow"></RaceLeaderboardByDistrict>
                <RaceLeaderboardGlobal :race-leaderboard-global-items="raceLeaderboardGlobalItems"
                    :race-leaderboard-global-show="raceLeaderboardGlobalShow"></RaceLeaderboardGlobal>
            </v-container>
        </v-main>
        <v-footer :color="`#1a5493`">
            <v-container>
                <v-row>
                    <p>Developed by Glomatico</p>
                    <v-spacer></v-spacer>
                    <v-btn :href="`https://github.com/glomatico/ttr-race-tracker`" :target="`_blank`"
                        :icon="`mdi-github`" class="mx-4" size="medium" variant="plain"></v-btn>
                </v-row>
            </v-container>
        </v-footer>
    </v-app>
</template>

<script lang="ts" setup>
useSeoMeta({
    title: 'Toontown Rewritten Race Tracker',
    ogTitle: 'Toontown Rewritten Race Tracker',
    description: 'A website to track Toontown Rewritten racing scores.',
    ogDescription: 'A website to track Toontown Rewritten racing scores.',
    author: 'Glomatico',
})
const districtItems = ref<string[]>(['Global'])
const raceTypeItems = ref<string[]>([
    'Airborne Acres',
    'Airborne Acres Rev',
    'Blizzard Boulevard',
    'Blizzard Boulevard Rev',
    'City Circuit',
    'City Circuit Rev',
    'Corkscrew Coliseum',
    'Corkscrew Coliseum Rev',
    'Rustic Raceway',
    'Rustic Raceway Rev',
    'Screwball Stadium',
    'Screwball Stadium Rev'
])
const raceTypeDisabled = ref<boolean>(true)
const raceLeaderboardByDistrictItems = ref<any[]>([])
const raceLeaderboardByDistrictShow = ref<boolean>(false)
const raceLeaderboardGlobalItems = ref<any[]>([])
const raceLeaderboardGlobalShow = ref<boolean>(false)
const selectedDistrict = ref<string>('')
const selectedRaceType = ref<string>('')

let races: any = undefined

async function setRaces() {
    const response = await fetch('https://toontownrewritten.com/api/racing')
    races = await response.json()
}

async function setDistrictItems() {
    districtItems.value.push(...Object.keys(races.all_time).sort())
}

async function setRaceTypeItems() {
    selectedRaceType.value = raceTypeItems.value[0]
    raceTypeDisabled.value = false
    if (selectedDistrict.value === 'Global') {
        raceLeaderboardGlobalShow.value = true
        raceLeaderboardByDistrictShow.value = false
        await setLeaderboardGlobalItems()
    } else {
        raceLeaderboardByDistrictShow.value = true
        raceLeaderboardGlobalShow.value = false
        await setLeaderboardByDistrictItems()
    }
}

async function setLeaderboardByDistrict() {
    if (selectedDistrict.value === 'Global') {
        await setLeaderboardGlobalItems()
    } else {
        await setLeaderboardByDistrictItems()
    }
}

async function setLeaderboardByDistrictItems() {
    const items = races.all_time[selectedDistrict.value][selectedRaceType.value].map((element: any[]) => ({
        toonName: element[0],
        toonDna: element[1],
        raceTime: element[2]
    }))
    raceLeaderboardByDistrictItems.value = items
}

async function setLeaderboardGlobalItems() {
    const items = Object.keys(races.all_time)
        .sort()
        .flatMap(district =>
            (races.all_time[district][selectedRaceType.value] || []).map(
                ([toonName, toonDna, raceTime]: [string, string, number]) => ({
                    toonName,
                    toonDna,
                    raceTime,
                    district
                })
            )
        )
    raceLeaderboardGlobalItems.value = items
}



onMounted(async () => {
    await setRaces()
    await setDistrictItems()
})
</script>

<style></style>
