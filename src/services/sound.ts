import { Service, Inject } from 'typedi';
import { ISound, ISoundInputDTO } from '../interfaces/ISound';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';

@Service()
export default class SoundService {
    public constructor(
        @Inject('soundModel') private soundModel: Models.SoundModel,
        @Inject('contentSoundModel') private contentSoundModel: Models.ContentSoundModel,
        @Inject('questionSoundModel') private questionSoundModel: Models.QuestionSoundModel,
        @Inject('logger') private logger,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    ) {}

    public async create(soundInput: ISoundInputDTO): Promise<{ sound: ISound }> {
        try {
            this.logger.silly('Creating sound', soundInput);

            const sound: ISound = await this.soundModel.create({
                ...soundInput,
            });

            if (!sound) {
                throw new Error('Sound cannot be created');
            }

            return { sound };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async update(soundId: number, soundInput: ISoundInputDTO): Promise<{ sound: ISound }> {
        const sound = await this.soundModel.findOne({
            where: {
                id: soundId,
            },
        });

        if (!sound) {
            throw new Error('Sound not found.');
        }

        this.logger.silly('Updating sound');
        const updatedSound: ISound = await sound.update(soundInput);

        if (!updatedSound) {
            throw new Error('Sound could not be updated.');
        }

        return { sound: updatedSound };
    }
    
    public async handleContentSound(contentId, soundId)
    {
		const contentSoundInput = {
			contentId: contentId,
			soundId: soundId,
		}
		
		const contentSound = await this.contentSoundModel.create({
            ...contentSoundInput,
        });

        if (!contentSound) {
            throw new Error('Content Sound cannot be created');
        }

        return { contentSound };
	
    }
    
    public async handleQuestionSound(questionId, soundId)
    {
		const questionSoundInput = {
			questionId: questionId,
			soundId: soundId,
		}
		
		const questionSound = await this.questionSoundModel.create({
            ...questionSoundInput,
        });

        if (!questionSound) {
            throw new Error('Question Sound cannot be created');
        }

        return { questionSound };
	
    }
}
