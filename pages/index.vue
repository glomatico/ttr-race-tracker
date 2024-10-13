<template>
    <v-app>
        <v-app-bar :title="`Toontown Rewritten Race Tracker`" :color="`#1a5493`">
        </v-app-bar>
        <v-main>
            <v-container>
                <v-row class="ga-4 my-4">
                    <v-select class="w-25" :label="`District`" :items="districtsData"
                        v-model:model-value='selectedDistrict' @update:model-value="setRaceTypesData()">
                    </v-select>
                    <v-select class="w-25" :label="`Race type`" :disabled="raceTypesDisabled" :items="raceTypesData"
                        v-model:model-value='selectedRaceType' @update:model-value="setLeaderboardTableItems()">
                    </v-select>
                </v-row>
                <v-data-table-virtual :headers="[{
                    title: 'Toon name',
                    key: 'toonName',
                },
                {
                    title: 'Race time',
                    key: 'raceTime',
                }
                ]" height="400" :items="raceLeaderboardItems">
                    <template #item="{ item }">
                        <tr>
                            <td class="w-50">
                                <v-avatar>
                                    <v-img
                                        :src="`https://rendition.toontownrewritten.com/render/${item.toonDna}/portrait/128x128.webp`"></v-img>
                                </v-avatar>
                                {{ item.toonName }}
                            </td>
                            <td class="w-25">{{ getFormattedRaceTime(item.raceTime) }}</td>
                        </tr>
                    </template>
                </v-data-table-virtual>
            </v-container>
        </v-main>
    </v-app>
</template>

<script lang="ts" setup>
useSeoMeta({
    title: 'Toontown Rewritten Race Tracker',
    ogTitle: 'Toontown Rewritten Race Tracker',
    description: 'A website to track Toontown Rewritten racing scores.',
    ogDescription: 'A website to track Toontown Rewritten racing scores.',
})
const districtsData = ref<string[]>([])
const raceTypesData = ref<string[]>([])
const raceTypesDisabled = ref<boolean>(true)
const raceLeaderboardItems = ref<any[]>([])
const selectedDistrict = ref<string>('')
const selectedRaceType = ref<string>('')

let races: any = undefined

async function setRaces() {
    const response = await fetch('https://toontownrewritten.com/api/racing')
    races = await response.json()
}

async function setDistrictsData() {
    districtsData.value = Object.keys(races.all_time).sort()
}

async function setRaceTypesData() {
    raceTypesData.value = Object.keys(races.all_time[selectedDistrict.value]).sort()
    raceTypesDisabled.value = false
    selectedRaceType.value = raceTypesData.value[0]
    setLeaderboardTableItems()
}

async function setLeaderboardTableItems() {
    raceLeaderboardItems.value = races.all_time[selectedDistrict.value][selectedRaceType.value].map((element: any[]) => ({
        toonName: element[0],
        toonDna: element[1],
        raceTime: element[2]
    }));
}

function getFormattedRaceTime(raceTime: number) {
    const date = new Date(raceTime * 1000)
    const minutes = date.getUTCMinutes().toString().padStart(2, '0')
    const seconds = date.getUTCSeconds().toString().padStart(2, '0')
    const milliseconds = date.getUTCMilliseconds().toString().padStart(3, '0')
    return `${minutes}:${seconds}.${milliseconds}`
}

onMounted(async () => {
    await setRaces()
    await setDistrictsData()
})
</script>

<style></style>
