<template>
    <v-data-table-virtual :headers="[{
        title: 'Toon name',
        key: 'toonName',
    },
    {
        title: 'Race time',
        key: 'raceTime',
    }
    ]" :sort-by="[{ key: 'raceTime', order: 'asc' }]" :items="items">
        <template #item="{ item }">
            <tr>
                <td>
                    <v-avatar>
                        <v-img
                            :src="`https://rendition.toontownrewritten.com/render/${item.toonDna}/portrait/128x128.webp`"></v-img>
                    </v-avatar>
                    {{ item.toonName }}
                </td>
                <td>{{ getFormattedRaceTime(item.raceTime) }}</td>
            </tr>
        </template>
    </v-data-table-virtual>
</template>

<script lang="ts">
export default {
    props: {
        items: {
            type: Array,
            required: true
        }
    },
}
</script>
