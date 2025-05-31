<template>
    <transition name="modal-animation">
        <div v-show="modalEventCalendarActive" class="modal">
            <transition name="modal-animation-inner">
                <div v-show="modalEventCalendarActive" class="modal-inner">
                    <i @click="closeEventCalendarModal" class="far fa-times-circle"></i>
                    <div class="modal-content">
                        <h2 class="mb-3 text-center">Calendário</h2>
                        <transition name="fade-slide" mode="out-in">
                            <div v-if="currentDay" :key="currentDayIndex" class="table-scroll-wrapper">
                                <h5 class="text-center">{{ currentDay.data }}</h5>
                                <el-table :data="[{}]" empty-text="Nenhum dado disponível" border style="min-width: 800px">
                                    <el-table-column v-for="stage in currentDay.stages"
                                                     :key="stage.name"
                                                     :label="stage.name"
                                                     align="center">
                                        <template #default>
                                            <div v-if="stage.performers.length">
                                                <div v-for="performer in stage.performers" :key="performer.name">
                                                    {{ performer.time ? performer.time + ' - ' + performer.name : performer.name }}
                                                </div>
                                            </div>
                                            <div v-else class="text-muted">Sem performers</div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </transition>

                        <div class="btn-container text-center">
                            <el-button @click="currentDayIndex--" :disabled="currentDayIndex === 0">Anterior</el-button>
                            <el-button @click="currentDayIndex++" :disabled="currentDayIndex >= eventCalendarData.length - 1">Próximo</el-button>
                            <button type="button" class="btn btn-danger btn-cancelar" style="margin-left:12px;" @click="closeEventCalendarModal">Sair</button>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>

<script>
    import axios from 'axios';
    import Swal from 'sweetalert2';

    export default {
        name: 'ModalEventCalendar',
        props: ['modalEventCalendarActive'],
        data() {
            return {
                eventCalendarData: [],
                currentDayIndex: 0
            };
        },
        computed: {
            currentDay() {
                return this.eventCalendarData[this.currentDayIndex];
            }
        },
        mounted() {
            const eventId = this.$route.params.id;
            this.fetchEventCalendar(eventId);
        },
        methods: {
            closeEventCalendarModal() {
                this.$emit('closeEventCalendarModal');
            },
            async fetchEventCalendar(eventId) {
                try {
                    const response = await axios.get('https://localhost:7216/api/Events/GetEventCalendar', {
                        params: {
                            eventId: eventId
                        }
                    });
                    this.eventCalendarData = response.data || [];
                    this.currentDayIndex = 0;
                } catch (error) {
                    const message = error.response?.data?.message || 'Erro de pesquisa. Tente novamente.';
                    Swal.fire('Erro', message, 'error');
                }
            }
        }
    };
</script>

<style scoped>
    .modal-animation-enter-active,
    .modal-animation-leave-active {
        transition: opacity 0.3s ease;
    }

    .modal-animation-enter-from,
    .modal-animation-leave-to {
        opacity: 0;
    }

    .modal-animation-inner-enter-active {
        transition: all 0.3s ease 0.15s;
    }

    .modal-animation-inner-leave-active {
        transition: all 0.3s ease;
    }

    .modal-animation-inner-enter-from {
        opacity: 0;
        transform: scale(0.8);
    }

    .modal-animation-inner-leave-to {
        transform: scale(0.8);
    }

    .modal {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        width: 100vw;
        position: fixed;
        top: 0;
        left: 0;
        background-color: rgba(255, 255, 255, 0.7);
    }

    .modal-inner {
        position: relative;
        max-width: 900px;
        width: 95%;
        background-color: white;
        padding: 50px 20px 20px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

        .modal-inner i {
            position: absolute;
            top: 15px;
            right: 15px;
            font-size: 20px;
            cursor: pointer;
        }

            .modal-inner i:hover {
                color: crimson;
            }

    .fade-slide-enter-active,
    .fade-slide-leave-active {
        transition: all 0.1s ease;
    }

    .fade-slide-enter-from {
        opacity: 0;
        transform: translateX(10px);
    }

    .fade-slide-leave-to {
        opacity: 0;
        transform: translateX(-10px);
    }

    .table-scroll-wrapper {
        overflow-x: auto;
        width: 100%;
    }
</style>
