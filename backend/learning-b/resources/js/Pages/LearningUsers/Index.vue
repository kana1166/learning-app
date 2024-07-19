<script setup>
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.vue";
import { Head } from "@inertiajs/vue3";
import { Inertia } from "@inertiajs/inertia";
import { ref, onMounted } from "vue";
import { useForm } from "@inertiajs/vue3";
import { Ziggy } from "@/ziggy"; // Ziggyのルートをインポート

// サーバーから渡されるデータをpropsで受け取ります
const props = defineProps({
    users: Array,
});
console.log(props.users);

const form = useForm({
    name: "",
    email: "",
});

onMounted(() => {
    console.log("Users:", props.users); // デバッグログ
});

// ユーザー追加の関数
const addUser = () => {
    Inertia.post(route("learning-user.store", Ziggy), createUserForm.value, {
        // Ziggyのルートを使用
        onSuccess: () => {
            console.log("User added successfully");
            form.reset();
            refreshUsers();
        },
    });
};

// ユーザー削除の関数
const deleteUser = (id) => {
    if (confirm("本当に削除しますか？")) {
        Inertia.delete(route("learning-user.destroy", { id }, Ziggy), {
            // Ziggyのルートを使用
            onSuccess: () => {
                console.log("User deleted successfully");
                refreshUsers();
            },
        });
    }
};

const editingUser = ref(null);
const editForm = useForm({
    name: "",
    email: "",
});

const editUser = (user) => {
    if (user) {
        editingUser.value = user.user_id;
        editForm.value = {
            name: user.name,
            email: user.email,
        };
        console.log("Edit Form:", editForm.value); // デバッグログ
    }
};

const saveUser = () => {
    Inertia.put(
        route("learning-user.update", { id: editingUser.value }, Ziggy),
        editForm.value,
        {
            onSuccess: () => {
                console.log("User updated successfully");
                editingUser.value = null;
                editForm.reset();
                refreshUsers();
            },
        }
    );
};

const refreshUsers = () => {
    // ユーザーリストを更新するためのロジックを追加します
    Inertia.reload({ only: ["users"] });
};
</script>

<template>
    <Head title="Dashboard" />

    <AuthenticatedLayout>
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                ユーザー管理
            </h2>
        </template>

        <div>
            <h1>ユーザー一覧</h1>
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            ID
                        </th>
                        <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            名前
                        </th>
                        <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            メール
                        </th>
                        <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            アクション
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="user in users" :key="user.id">
                        <td class="px-6 py-4 whitespace-nowrap">
                            {{ user.user_id }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <template v-if="editingUser === user.user_id">
                                <input
                                    v-model="editForm.value.name"
                                    class="form-input"
                                />
                            </template>
                            <template v-else>
                                {{ user.name }}
                            </template>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <template v-if="editingUser === user.user_id">
                                <input
                                    v-model="editForm.value.email"
                                    class="form-input"
                                />
                            </template>
                            <template v-else>
                                {{ user.email }}
                            </template>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <template v-if="editingUser === user.user_id">
                                <button
                                    @click="saveUser(user.user_id)"
                                    class="text-green-600 hover:text-green-900"
                                >
                                    保存
                                </button>
                                <button
                                    @click="editingUser = null"
                                    class="text-gray-600 hover:text-gray-900 ml-4"
                                >
                                    キャンセル
                                </button>
                            </template>
                            <template v-else>
                                <button
                                    @click="editUser(user)"
                                    class="text-indigo-600 hover:text-indigo-900"
                                >
                                    編集
                                </button>
                                <button
                                    @click="deleteUser(user.user_id)"
                                    class="text-red-600 hover:text-red-900 ml-4"
                                >
                                    削除
                                </button>
                            </template>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </AuthenticatedLayout>
</template>

<style scoped>
/* 必要に応じてスタイルを追加 */
</style>
