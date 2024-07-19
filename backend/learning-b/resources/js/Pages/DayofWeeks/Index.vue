<script setup>
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/vue3";
</script>

<template>
    <Head title="Dashboard" />

    <AuthenticatedLayout>
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                ウイークデイ
            </h2>
        </template>

        <div>Hello World!</div>
    </AuthenticatedLayout>
</template>
