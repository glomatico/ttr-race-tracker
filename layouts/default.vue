<template>
    <v-app>
        <v-toolbar :color="`#1a5493`">
            <v-container>
                <v-toolbar-title>Toontown Rewritten Race Tracker</v-toolbar-title>
            </v-container>
        </v-toolbar>
        <v-main>
            <slot />
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

</script>

<style></style>
