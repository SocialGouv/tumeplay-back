import { Service, Inject } from 'typedi';
import { IThematique, IThematiqueInputDTO } from '../interfaces/IThematique';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';

@Service()
export default class ThematiqueService {
    public constructor(
        @Inject('thematiqueModel') private thematiqueModel: any,
        @Inject('logger') private logger,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    ) {}

    public async create(thematiqueInput: IThematiqueInputDTO): Promise<{ thematique: IThematique }> {
        try {
            this.logger.silly('Creating thematique', thematiqueInput);

            thematiqueInput.active = thematiqueInput.active == 'on';

            const thematique: IThematique = await this.thematiqueModel.create({
                ...thematiqueInput,
            });

            if (!thematique) {
                throw new Error('Content cannot be created');
            }

            return { thematique };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async update(
        thematiqueId: number,
        thematiqueInput: Partial<IThematiqueInputDTO>,
    ): Promise<{ thematique: IThematique }> {
        const thematique = await this.thematiqueModel.findOne({
            where: {
                id: thematiqueId,
            },
        });

        if (!thematique) {
            throw new Error('Content not found.');
        }

        this.logger.silly('Updating thematique', thematiqueInput);

        thematiqueInput.active = thematiqueInput.active == 'on';

        await thematique.update(thematiqueInput);

        return { thematique };
    }
    public async findAll(): Promise<{ thematiques: IThematique[] }> {
        try {
            this.logger.silly('Finding all thematiques');
            const thematiques: IThematique[] = await this.thematiqueModel.findAll();

            return { thematiques };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    public async findById(id: number): Promise<{ thematique: IThematique }> {
        try {
            this.logger.silly('Finding thematique');
            const thematique: IThematique = await this.thematiqueModel.findOne({
                where: { id },
            });

            if (!thematique) {
                let err = new Error('thematique cannot be found');
                throw err;
            }

            return { thematique };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    public async findBy_idFictitious(idFictitious: number): Promise<{ thematique: IThematique }> {
        try {
            this.logger.silly('Finding thematique');
            const thematique: IThematique = await this.thematiqueModel.findOne({
                where: { idFictitious },
            });
            return { thematique };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
}
