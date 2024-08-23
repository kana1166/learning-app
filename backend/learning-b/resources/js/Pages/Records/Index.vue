<script setup>
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.vue";
import { Head } from "@inertiajs/vue3";
import { Inertia } from "@inertiajs/inertia";
import { ref, watch } from "vue";
import { useForm } from "@inertiajs/vue3";
import { Ziggy } from "@/ziggy"; // Ziggyのルートをインポート

// サーバーから渡されるデータをpropsで受け取ります
const props = defineProps({
    records: Array,
    users: Array,
});
console.log(props.records);
console.log(props.users);

const form = useForm({
    date: "",
    duration: "",
    note: "",
    user_id: "",
});

const selectedUserId = ref("");

const filteredRecords = ref(props.records);

const filterRecordsByUser = (userId) => {
    selectedUserId.value = userId;
    if (userId) {
        filteredRecords.value = props.records.filter(
            (record) => record.user_id === userId
        );
    } else {
        filteredRecords.value = props.records;
    }
};

watch(
    selectedUserId,
    (newUserId) => {
        filterRecordsByUser(newUserId);
    },
    { immediate: true }
);

const deleteRecord = (id) => {
    if (confirm("本当に削除しますか？")) {
        Inertia.delete(route("records.destroy", { id }, Ziggy), {
            // Ziggyのルートを使用
            onSuccess: () => {
                console.log("Record deleted successfully");
                refreshRecords();
            },
        });
    }
};

const editingRecord = ref(null);
const editForm = useForm({
    date: "",
    duration: "",
    note: "",
    learning_user_id: "",
});

const editRecord = (record) => {
    if (record) {
        editingRecord.value = record.record_id;
        editForm.value = {
            date: record.date,
            duration: record.duration,
            note: record.note,
            learning_user_id: record.user_id,
        };
        console.log("Edit Form:", editForm.value); // デバッグログ
    }
};

const saveRecord = () => {
    console.log("Edit Form Data before sending:", editForm);
    Inertia.put(
        route("records.update", { id: editingRecord.value }),
        editForm.value,
        {
            onSuccess: () => {
                console.log("Record updated successfully");
                editingRecord.value = null;
                editForm.reset(); // フォームデータをリセット
                refreshRecords(); // レコードをリフレッシュ
            },
            onError: (errors) => {
                console.log("Error updating record:", errors);
            },
        }
    );
};

const refreshRecords = () => {
    Inertia.reload({ only: ["records"] });
};
</script>

<template>
    <Head title="Dashboard" />

    <AuthenticatedLayout>
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                学習記録
            </h2>
        </template>
        <div>
            <select v-model="selectedUserId">
                <option value="">全てのユーザー</option>
                <option
                    v-for="user in props.users"
                    :key="user.user_id"
                    :value="user.user_id"
                >
                    {{ user.name }}
                </option>
            </select>
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th
                            scope="col"
                            class="px-[120px] py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            日付
                        </th>
                        <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            学習時間
                        </th>
                        <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            勉強内容
                        </th>
                        <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            ユーザーID
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="record in filteredRecords" :key="record.id">
                        <td class="px-[120px] py-4 whitespace-nowrap">
                            <template v-if="editingRecord === record.record_id">
                                <input
                                    v-model="editForm.value.date"
                                    class="form-input"
                                />
                            </template>
                            <template v-else>
                                {{ record.date }}
                            </template>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <template v-if="editingRecord === record.record_id">
                                <input
                                    v-model="editForm.value.duration"
                                    class="form-input"
                                />
                            </template>
                            <template v-else>
                                {{ record.duration }} 時間
                            </template>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <template v-if="editingRecord === record.record_id">
                                <input
                                    v-model="editForm.value.note"
                                    class="form-input"
                                />
                            </template>
                            <template v-else>
                                {{ record.note }}
                            </template>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <template v-if="editingRecord === record.record_id">
                                <input
                                    v-model="editForm.value.learning_user_id"
                                    class="form-input"
                                />
                            </template>
                            <template v-else>
                                {{ record.user_id }}
                            </template>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <template v-if="editingRecord === record.record_id">
                                <button
                                    @click="saveRecord(record.record_id)"
                                    class="text-green-600 hover:text-green-900"
                                >
                                    保存
                                </button>
                                <button
                                    @click="editingRecord = null"
                                    class="text-gray-600 hover:text-gray-900 ml-4"
                                >
                                    キャンセル
                                </button>
                            </template>
                            <template v-else>
                                <button
                                    @click="editRecord(record)"
                                    class="text-indigo-600 hover:text-indigo-900"
                                >
                                    編集
                                </button>
                                <button
                                    @click="deleteRecord(record.record_id)"
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
