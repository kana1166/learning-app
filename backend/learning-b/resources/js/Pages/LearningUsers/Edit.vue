<script setup>
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.vue";
import { Head } from "@inertiajs/vue3";
import { ref } from "vue";
import { Inertia } from "@inertiajs/inertia";

// サーバーから渡されるデータをpropsで受け取ります
const props = defineProps({
    learning_user: Object,
});

const updateUser = () => {
    console.log("Updating user:", form.value); // デバッグ用ログ
    Inertia.put(`/learning_user/${props.learning_user.user_id}`, form.value)
        .then((response) => {
            console.log("User updated:", response); // 成功時のログ
        })
        .catch((error) => {
            console.error("Update failed:", error); // エラー時のログ
        });
};
</script>

<template>
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <Head title="Edit User" />

    <AuthenticatedLayout>
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                ユーザー編集
            </h2>
        </template>

        <div>
            <form @submit.prevent="updateUser">
                <div>
                    <label for="name">名前</label>
                    <input v-model="form.name" id="name" type="text" />
                </div>
                <div>
                    <label for="email">メール</label>
                    <input v-model="form.email" id="email" type="email" />
                </div>
                <button type="submit">更新</button>
            </form>
        </div>
    </AuthenticatedLayout>
</template>

<style scoped>
/* 必要に応じてスタイルを追加 */
</style>
