<template>
    <v-container>
        <v-row class="ga-4 my-4">
            <v-select class="w-25" :label="`District`" :disabled="districtsDisabled" :items="districtItems"
                v-model:model-value='selectedDistrict' @update:model-value="onDistrictChange()">
            </v-select>
            <v-select class="w-25" :label="`Race type`" :disabled="raceTypeDisabled" :items="raceTypeItems"
                v-model:model-value='selectedRaceType' @update:model-value="onRaceTypeChange()">
            </v-select>
        </v-row>
        <div v-if="races === undefined">
            <div class="text-center">
                <v-progress-circular indeterminate></v-progress-circular>
            </div>
        </div>
        <div v-else>
            <div v-if="selectedDistrict === 'Global'">
                <RaceLeaderboardGlobal :items="raceLeaderboardGlobalItems">
                </RaceLeaderboardGlobal>
            </div>
            <div v-else>
                <RaceLeaderboardByDistrict :items="raceLeaderboardByDistrictItems">
                </RaceLeaderboardByDistrict>
            </div>
        </div>
    </v-container>
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
const districtsDisabled = ref<boolean>(true)
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
const races = ref<any | undefined>(undefined)

async function setRaces() {
    const response = await fetch('https://toontownrewritten.com/api/racing')
    races.value = await response.json()
    districtsDisabled.value = false
    raceTypeDisabled.value = false
    selectedRaceType.value = raceTypeItems.value[0]
}

async function setDistrictItems() {
    districtItems.value.push(...Object.keys(races.value.all_time).sort())
}

async function onDistrictChange() {
    await setLeaderboard()
}

async function onRaceTypeChange() {
    await setLeaderboard()
}

async function setLeaderboard() {
    if (selectedDistrict.value === '') {
        return
    } else if (selectedDistrict.value === 'Global') {
        await setLeaderboardGlobalItems()
    } else {
        await setLeaderboardByDistrictItems()
    }
}

async function setLeaderboardByDistrictItems() {
    raceLeaderboardByDistrictItems.value = (races.value.all_time[selectedDistrict.value][selectedRaceType.value] || []).map((element: any[]) => ({
        toonName: element[0],
        toonDna: element[1],
        raceTime: element[2]
    }))
}

async function setLeaderboardGlobalItems() {
    raceLeaderboardGlobalItems.value = Object.keys(races.value.all_time)
        .sort()
        .flatMap(district =>
            (races.value.all_time[district][selectedRaceType.value] || []).map(
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
