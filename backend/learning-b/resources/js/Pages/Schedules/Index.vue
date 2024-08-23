<script setup>
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.vue";
import { Head } from "@inertiajs/vue3";
import { Inertia } from "@inertiajs/inertia";
import { ref, watch } from "vue";
import { useForm } from "@inertiajs/vue3";
import { Ziggy } from "@/ziggy"; // Ziggyのルートをインポート

// サーバーから渡されるデータをpropsで受け取ります
const props = defineProps({
    schedules: Array,
    users: Array,
});
console.log("Schedules:", props.schedules); // デバッグログ
console.log("Users:", props.users); // デバッグログ

const form = useForm({
    day_of_week_id: "",
    duration: "",
    user_id: "",
});

const selectedUserId = ref("");

const filteredSchedules = ref(props.schedules);

const filterSchedulesByUser = (userId) => {
    selectedUserId.value = userId;
    if (userId) {
        filteredSchedules.value = props.schedules.filter(
            (schedule) => schedule.user_id === userId
        );
    } else {
        filteredSchedules.value = props.schedules;
    }
    console.log("Filtered Schedules:", filteredSchedules.value); // デバッグログ
};

watch(
    selectedUserId,
    (newUserId) => {
        filterSchedulesByUser(newUserId);
    },
    { immediate: true }
);

const deleteSchedule = (id) => {
    if (confirm("本当に削除しますか？")) {
        Inertia.delete(route("schedules.destroy", { id }, Ziggy), {
            // Ziggyのルートを使用
            onSuccess: () => {
                console.log("Schedules deleted successfully");
                refreshSchedules();
            },
        });
    }
};

const editingSchedule = ref(null);
const editForm = useForm({
    day_of_week_id: "",
    duration: "",
});

const editSchedule = (schedule) => {
    if (schedule) {
        editingSchedule.value = schedule.schedule_id;
        editForm.value = {
            day_of_week_id: schedule.day_of_week_id,
            duration: schedule.duration,
        };
        console.log("Edit Form:", editForm.value); // デバッグログ
    }
};

const saveSchedule = () => {
    Inertia.put(
        route("schedules.update", { id: editingSchedule.value }, Ziggy),
        editForm.value, // editForm.value を渡す
        {
            onSuccess: () => {
                console.log("Record updated successfully");
                editingSchedule.value = null;
                editForm.reset();
                refreshSchedules();
            },
        }
    );
};

const refreshSchedules = () => {
    Inertia.reload({ only: ["schedules"] });
};
</script>

<template>
    <Head title="Dashboard" />

    <AuthenticatedLayout>
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                スケジュール
            </h2>
        </template>

        <div>
            <select v-model="selectedUserId">
                <option value="">全て</option>
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
                            曜日
                        </th>
                        <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            学習時間
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr
                        v-for="schedule in filteredSchedules"
                        :key="schedule.id"
                    >
                        <td class="px-[120px] py-4 whitespace-nowrap">
                            <template
                                v-if="editingSchedule === schedule.schedule_id"
                            >
                                <input
                                    v-model="editForm.value.day_of_week_id"
                                    class="form-input"
                                />
                            </template>
                            <template v-else>
                                {{ schedule.day_of_week.name }}
                            </template>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <template
                                v-if="editingSchedule === schedule.schedule_id"
                            >
                                <input
                                    v-model="editForm.value.duration"
                                    class="form-input"
                                />
                            </template>
                            <template v-else>
                                {{ schedule.duration }} 時間
                            </template>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <template
                                v-if="editingSchedule === schedule.schedule_id"
                            >
                                <button
                                    @click="saveSchedule"
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
                                    @click="editSchedule(schedule)"
                                    class="text-indigo-600 hover:text-indigo-900"
                                >
                                    編集
                                </button>
                                <button
                                    @click="
                                        deleteSchedule(schedule.schedule_id)
                                    "
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
