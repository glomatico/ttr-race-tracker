<template>
    <v-app>
        <v-app-bar :title="`Toontown Rewritten Race Tracker`" :color="`#1a5493`">
        </v-app-bar>
        <v-main>
            <v-container>
                <v-row class="ga-4 my-4">
                    <v-select class="w-25" :label="`District`" :items="districtItems"
                        v-model:model-value='selectedDistrict' @update:model-value="onDistrictChange()">
                    </v-select>
                    <v-select class="w-25" :label="`Race type`" :disabled="raceTypeDisabled" :items="raceTypeItems"
                        v-model:model-value='selectedRaceType' @update:model-value="onRaceTypeChange()">
                    </v-select>
                </v-row>
                <div v-if="selectedDistrict === 'Global'">
                    <RaceLeaderboardGlobal :items="raceLeaderboardGlobalItems">
                    </RaceLeaderboardGlobal>
                </div>
                <div v-else>
                    <RaceLeaderboardByDistrict :items="raceLeaderboardByDistrictItems">
                    </RaceLeaderboardByDistrict>
                </div>
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
const raceLeaderboardGlobalItems = ref<any[]>([])
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

async function onDistrictChange() {
    raceTypeDisabled.value = false
    selectedRaceType.value = raceTypeItems.value[0]
    await setLeaderboard()
}

async function onRaceTypeChange() {
    await setLeaderboard()
}

async function setLeaderboard() {
    if (selectedDistrict.value === 'Global') {
        await setLeaderboardGlobalItems()
    } else {
        await setLeaderboardByDistrictItems()
    }
}

async function setLeaderboardByDistrictItems() {
    raceLeaderboardByDistrictItems.value = (races.all_time[selectedDistrict.value][selectedRaceType.value] || []).map((element: any[]) => ({
        toonName: element[0],
        toonDna: element[1],
        raceTime: element[2]
    }))
}

async function setLeaderboardGlobalItems() {
    raceLeaderboardGlobalItems.value = Object.keys(races.all_time)
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
}

onMounted(async () => {
    await setRaces()
    await setDistrictItems()
})
</script>

<style></style>
