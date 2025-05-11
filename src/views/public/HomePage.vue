<template>
    <div class="page-content-container">
        <div class="about-container" v-if="!authState.isLoggedIn">
            <h1 class="mb-3 text-center">StageScout</h1>
            <p class="lead">A StageScout é uma ferramenta de aglomeração de informação, promoção de eventos e levantamento de opiniões, desenvolvida como projeto final de licenciatura de Engenharia Informática, obtido na universidade ISTEC Porto.</p>
            <p class="lead">
                As principais funções da StageScout são:<br>
                ● Atuar como ponto de encontro de toda a informação essencial dos festivais e eventos, a serem realizados em todo o país.<br>
                ● Plataforma de notícias e atualizações dos conteúdos dos eventos e festivais de música.<br>
                ● Ferramenta de levantamento de opiniões e avaliações, obtidas por influência direta dos clientes/utilizadores.<br>
                ● Plataforma de gestão de informação e levantamento de dados estatísticos, para uso por parte das promotoras e organizadoras de eventos e festivais.<br>
            </p>
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
                    <!-- Left: Events Table -->
                    <div class="col-md-6">
                        <h6>Eventos</h6>
                        <el-table :data="followedEvents" :stripe="true" style="width: 100%" @row-click="GoToEventDetails" :default-sort="{ prop: 'dataInicio', order: 'ascending' }">
                            <el-table-column prop="nome" label="Nome" width="250"></el-table-column>
                            <el-table-column prop="local" label="Local" width="200"></el-table-column>
                            <el-table-column prop="dataInicio" label="Início" width="100"></el-table-column>
                            <el-table-column prop="dataFim" label="Fim" width="100"></el-table-column>
                            <el-table-column prop="estado" label="Estado" width="100"></el-table-column>
                        </el-table>

                        <!-- Pagination -->
                        <el-pagination :current-page="eventsPagination.page"
                                       :page-size="eventsPagination.pageSize"
                                       :total="followedEvents.length"
                                       @current-change="onEventsPageChange"
                                       layout="prev, pager, next">
                        </el-pagination>
                    </div>

                    <!-- Right: Artists Table -->
                    <div class="col-md-6">
                        <h6>Artistas</h6>
                        <el-table :data="followedArtists" highlight-current-row :stripe="true" style="width: 100%" @row-click="GoToArtistDetails" :default-sort="{ prop: 'data', order: 'ascending' }">
                            <el-table-column prop="nomePerformer" label="Performer" width="200"></el-table-column>
                            <el-table-column prop="nomeEvento" label="Evento" width="225"></el-table-column>
                            <el-table-column prop="palco" label="Palco" width="125"></el-table-column>
                            <el-table-column prop="data" label="Data" width="100"></el-table-column>
                            <el-table-column prop="hora" label="Hora" width="100"></el-table-column>
                        </el-table>

                        <!-- Pagination -->
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
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import axios from 'axios';

    export default {
        name: 'HeaderComponent',
        setup() {
            const router = useRouter();

            // Pagination State
            const eventsPagination = ref({
                page: 1,
                pageSize: 6,
            });

            const artistsPagination = ref({
                page: 1,
                pageSize: 6,
            });

            // Pagination Change Handlers
            const onEventsPageChange = (page) => {
                eventsPagination.value.page = page;
            };

            const onArtistsPageChange = (page) => {
                artistsPagination.value.page = page;
            };

            const GoToEventDetails = (rowData) => {
                router.push({ name: 'EventDetails', params: { id: rowData.id } });
            };

            const GoToArtistDetails = (rowData) => {
                router.push({ name: 'PerformerDetails', params: { id: rowData.id } });
            };

            // Columns Configuration
            const artistsColumns = [
                { title: 'Id', key: 'id' },
                { title: 'Performer', key: 'nomePerformer' },
                { title: 'Evento', key: 'nomeEvento' },
                { title: 'Palco', key: 'palco' },
                { title: 'Data', key: 'data' },
                { title: 'Hora', key: 'hora' },
            ];

            const eventsColumns = [
                { title: 'Id', key: 'id' },
                { title: 'Nome', key: 'nome' },
                { title: 'Local', key: 'local' },
                { title: 'Data de Início', key: 'dataInicio' },
                { title: 'Data de Fim', key: 'dataFim' },
                { title: 'Estado', key: 'estado' },
            ];

            return {
                eventsPagination,
                artistsPagination,
                onEventsPageChange,
                onArtistsPageChange,
                artistsColumns,
                eventsColumns,
                authState,
                GoToEventDetails,
                GoToArtistDetails,
            };
        },

        data() {
            return {
                followedEvents: [],
                followedArtists: [],
            };
        },

        watch: {
            'authState.isLoggedIn'() {
                if (authState.isLoggedIn) {
                    this.GetFollowedEntities();
                }
            },
        },

        mounted() {
            if (authState.isLoggedIn) {
                this.GetFollowedEntities();
            }
        },

        methods: {
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
</style>