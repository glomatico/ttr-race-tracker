<template>
    <v-container>
        <v-row>
            <v-col>
                <v-select label="District" :disabled="isDistrictPickerDisabled" :items="districtPickerItems"
                    v-model:model-value='selectedDistrict' @update:model-value="handleDistrictPick()" />
            </v-col>
            <v-col>
                <v-select label="Race type" :disabled="isRaceTypePickerDisabled" :items="raceTypePickerItems"
                    v-model:model-value='selectedRaceType' @update:model-value="handleRaceTypePick()" />
            </v-col>
        </v-row>
        <v-row>
            <v-col v-if="isLoadingSpinnerVisible" class="d-flex justify-center">
                <v-progress-circular indeterminate />
            </v-col>
            <v-col v-else-if="isErrorMessageVisible" class="d-flex justify-center">
                <v-label :text="errorMessage" />
            </v-col>
            <v-col v-else-if="isGlobalLeaderboardVisible">
                <GlobalLeaderboard :items="globalLeaderboardItems" />
            </v-col>
            <v-col v-else-if="isDistrictLeaderboardVisible">
                <DistrictLeaderboard :items="districtLeaderboardItems" />
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
export default {
    setup() {
        useSeoMeta({
            title: 'Toontown Rewritten Race Tracker',
            ogTitle: 'Toontown Rewritten Race Tracker',
            description: 'A website to track Toontown Rewritten racing scores.',
            ogDescription: 'A website to track Toontown Rewritten racing scores.',
            author: 'Glomatico',
        })
    },
    data() {
        return {
            isDistrictPickerDisabled: true,
            isRaceTypePickerDisabled: true,
            selectedDistrict: '',
            selectedRaceType: '',
            isLoadingSpinnerVisible: true,
            isErrorMessageVisible: false,
            errorMessage: 'An error occurred while fetching the data. Please try again later.',
            districtPickerItems: ['Global'],
            raceTypePickerItems: [
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
            ],
            isGlobalLeaderboardVisible: false,
            isDistrictLeaderboardVisible: false,
            globalLeaderboardItems: [],
            districtLeaderboardItems: [],
            races: undefined as any,
        }
    },
    methods: {
        async handleDistrictPick() {
            await this.setLeaderboard()
        },
        async handleRaceTypePick() {
            await this.setLeaderboard()
        },
        async setLeaderboard() {
            if (this.selectedDistrict === '') {
                return
            } else if (this.selectedDistrict === 'Global') {
                await this.setGlobalLeadboardItems()
                this.isGlobalLeaderboardVisible = true
                this.isDistrictLeaderboardVisible = false
            } else {
                await this.setDistrictLeaderboardItems()
                this.isGlobalLeaderboardVisible = false
                this.isDistrictLeaderboardVisible = true
            }
        },
        async setDistrictLeaderboardItems() {
            this.districtLeaderboardItems = (
                this.races.all_time[this.selectedDistrict][this.selectedRaceType] || []
            ).map((element: any[]) => ({
                toonName: element[0],
                toonDna: element[1],
                raceTime: element[2]
            }))
        },
        async setGlobalLeadboardItems() {
            this.globalLeaderboardItems = Object.keys(this.races.all_time)
                .sort()
                .flatMap(district =>
                    (this.races.all_time[district][this.selectedRaceType] || []).map(
                        ([toonName, toonDna, raceTime]: [string, string, number]) => ({
                            toonName,
                            toonDna,
                            raceTime,
                            district
                        })
                    )
                ) as []
        },
        async setRaces() {
            const response = await fetch('https://toontownrewritten.com/api/racing')
            if (response.status != 200) {
                this.isLoadingSpinnerVisible = false
                this.isErrorMessageVisible = true
                return
            }
            this.races = await response.json()
            this.selectedDistrict = this.districtPickerItems[0]
            this.selectedRaceType = this.raceTypePickerItems[0]
            this.isDistrictPickerDisabled = false
            this.isRaceTypePickerDisabled = false
            this.isLoadingSpinnerVisible = false
            this.setLeaderboard()
        },
        async setDistrictPickerItems() {
            this.districtPickerItems.push(...Object.keys(this.races.all_time).sort())
        },
    },
    async mounted() {
        await this.setRaces()
        await this.setDistrictPickerItems()
    }
}
</script>
