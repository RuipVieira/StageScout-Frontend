<template>
    <div class="page-content-container">
        <div class="about-container" v-if="!authState.isLoggedIn">
            <h1 class="mb-3 text-center">StageScout</h1>
            <p class="lead">A StageScout é uma ferramenta de aglomeração de informação, promoção de eventos e levantamento de opiniões, desenvolvida como projeto final de licenciatura de Engenharia Informática, obtido na universidade ISTEC Porto.</p>
            <p class="lead">As principais funções da StageScout são:</p>
            <ul class="lead arrow-list">
                <li>Atuar como ponto de encontro de toda a informação essencial dos festivais e eventos, a serem realizados em todo o país.</li>
                <li>Plataforma de notícias e atualizações dos conteúdos dos eventos e festivais de música.</li>
                <li>Ferramenta de levantamento de opiniões e avaliações, obtidas por influência direta dos clientes/utilizadores.</li>
                <li>Plataforma de gestão de informação e levantamento de dados estatísticos, para uso por parte das promotoras e organizadoras de eventos e festivais.</li>
            </ul>
            <p class="lead">
                A plataforma é intuitiva e responsiva, os seus utilizadores podem pesquisar facilmente pelos eventos e festivais que mais lhes interessam, criar a sua própria conta de utilizador para guardar uma lista de eventos para ainda mais fácil acesso e, também, inserir o seu feedback e avaliação dos eventos que presenciou.<br>
            </p>
            <p class="lead">
                Para obter acesso às principais funcionalidades da plataforma, é necessário efectuar o registo de uma conta ou fazer login com uma conta existente.<br>
            </p>
        </div>
        <div class="about-container" v-if="authState.isLoggedIn">
            <h1 class="mb-3 text-center">StageScout</h1>
            <p class="lead">
                Obrigado por utilizar a plataforma StageScout, hub de eventos musicais. <br>Se ainda não o fez, por favor configure as informações principais do seu perfil para poder submeter as suas avaliações e feedback dos eventos que presenciou.<br>
            </p>
        </div>
        <div class="card shadow-sm mb-4 fixed-card-top" v-if="authState.isLoggedIn">
            <div class="card-header">
                <h5 class="mb-0">A Seguir</h5>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <h6>Eventos</h6>
                        <el-table :data="followedEvents" empty-text="Nenhum dado disponível" :stripe="true" style="width: 100%" @row-click="GoToEventDetails" :default-sort="{ prop: 'dataInicio', order: 'ascending' }">
                            <el-table-column prop="name" label="Nome" width="250"></el-table-column>
                            <el-table-column prop="venue" label="Local" width="200"></el-table-column>
                            <el-table-column prop="startDate" label="Início" width="100"></el-table-column>
                            <el-table-column prop="endDate" label="Fim" width="100"></el-table-column>
                            <el-table-column prop="state" label="Estado" width="100"></el-table-column>
                        </el-table>

                        <el-pagination :current-page="eventsPagination.page"
                                       :page-size="eventsPagination.pageSize"
                                       :total="followedEvents.length"
                                       @current-change="onEventsPageChange"
                                       layout="prev, pager, next">
                        </el-pagination>
                    </div>

                    <div class="col-md-6">
                        <h6>Artistas</h6>
                        <el-table :data="followedArtists" empty-text="Nenhum dado disponível" highlight-current-row :stripe="true" style="width: 100%" @row-click="GoToArtistDetails" :default-sort="{ prop: 'data', order: 'ascending' }">
                            <el-table-column prop="performerName" label="Performer" width="200"></el-table-column>
                            <el-table-column prop="eventName" label="Evento" width="225"></el-table-column>
                            <el-table-column prop="stage" label="Palco" width="125"></el-table-column>
                            <el-table-column prop="date" label="Data" width="100"></el-table-column>
                            <el-table-column prop="time" label="Hora" width="100"></el-table-column>
                        </el-table>

                        <el-pagination :current-page="artistsPagination.page"
                                       :page-size="artistsPagination.pageSize"
                                       :total="followedArtists.length"
                                       @current-change="onArtistsPageChange"
                                       layout="prev, pager, next">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { authState } from '../../auth';
    import Swal from 'sweetalert2';
    import axios from 'axios';
    import { useRouter } from 'vue-router';

    export default {
        name: 'HeaderComponent',

        data() {
            return {
                eventsPagination: {
                    page: 1,
                    pageSize: 6,
                },
                artistsPagination: {
                    page: 1,
                    pageSize: 6,
                },
                followedEvents: [],
                followedArtists: [],
            };
        },

        computed: {
            authState() {
                return authState;
            }
        },

        created() {
            if (authState.isLoggedIn) {
                this.GetFollowedEntities();
            }
        },

        watch: {
            'authState.isLoggedIn'(newVal) {
                if (newVal) {
                    this.GetFollowedEntities();
                }
            }
        },

        methods: {
            onEventsPageChange(page) {
                this.eventsPagination.page = page;
            },

            onArtistsPageChange(page) {
                this.artistsPagination.page = page;
            },

            GoToEventDetails(rowData) {
                const router = useRouter();
                router.push({ name: 'EventDetails', params: { id: rowData.id } });
            },

            GoToArtistDetails(rowData) {
                const router = useRouter();
                router.push({ name: 'PerformerDetails', params: { id: rowData.id } });
            },

            async GetFollowedEntities() {
                try {
                    const response = await axios.get('https://localhost:7216/api/home/GetFollowedEntities', {
                        params: {
                            profileId: localStorage.getItem('profileId'),
                        },
                    });

                    this.followedEvents = response.data.followedEventsList || [];
                    this.followedArtists = response.data.followedPerformerEventsList || [];
                } catch (error) {
                    const message = error.response?.data?.message || 'Erro de pesquisa. Tente novamente.';
                    Swal.fire('Erro', message, 'error');
                }
            },
        },
    };
</script>


<style scoped>
    .about-container {
        margin: 2%;
    }

    ul.arrow-list {
        list-style: none;
        padding-left: 0;
    }

        ul.arrow-list li::before {
            content: "→ ";
            color: inherit;
        }
</style>