<template>
    <v-data-table-virtual :headers="[{
        title: 'Toon name',
        key: 'toonName',
    },
    {
        title: 'District',
        key: 'district',
    },
    {
        title: 'Race time',
        key: 'raceTime',
    }
    ]" height="576" :items="raceLeaderboardGlobalItems" v-show="raceLeaderboardGlobalShow">
        <template #item="{ item }">
            <tr>
                <td>
                    <v-avatar>
                        <v-img
                            :src="`https://rendition.toontownrewritten.com/render/${item.toonDna}/portrait/128x128.webp`"></v-img>
                    </v-avatar>
                    {{ item.toonName }}
                </td>
                <td>
                    {{ item.district }}
                </td>
                <td>{{ getFormattedRaceTime(item.raceTime) }}</td>
            </tr>
        </template>
    </v-data-table-virtual>
</template>

<script lang="ts" setup>
const props = defineProps<{
    raceLeaderboardByDistrictItems: any[],
    raceLeaderboardByDistrictShow: boolean,
}>()
const { raceLeaderboardByDistrictItems: raceLeaderboardGlobalItems, raceLeaderboardByDistrictShow: raceLeaderboardGlobalShow } = toRefs(props)
</script>

<style></style>
