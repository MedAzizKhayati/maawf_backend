import { AppModule } from '@/app.module';
import { Profile } from '@/profile/entities/profile.entity';
import { ProfileService } from '@/profile/profile.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { GroupChat } from './entities/chat.entity';
import { Gender } from '@/profile/enums/gender.enum';

describe('ChatService', () => {
  let chatService: ChatService;
  let profileService: ProfileService;
  let appModule: TestingModule;

  beforeAll(async () => {
    appModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    chatService = appModule.get<ChatService>(ChatService);
    profileService = appModule.get<ProfileService>(ProfileService);
  });

  it('should be defined', () => {
    expect(chatService).toBeDefined();
  });

  it('should get no group chats', async () => {
    const groupChat = await chatService.getChats('1');
    expect(groupChat).toMatchObject([]);
  });

  describe('create a group chat', () => {
    let profiles: Profile[] = [];
    beforeAll(async () => {
      await Promise.all(
        Array(4)
          .fill(0)
          .map(async () => {
            await profileService.create({
              firstName: 'test' + Math.random(),
              lastName: 'test',
              gender: Gender.PREFER_NOT_TO_SAY,
              publicKey: 'publicKey',
            } as Profile);
          }),
      );
    });

    it('should find atleast 4 profiles', async () => {
      // we need at least 4 profiles to make this test work
      profiles = await profileService.findAll();
      expect(profiles?.length).toBeGreaterThan(3);
    });

    it('should create a private group chat', async () => {
      const creator = profiles[0];
      const groupChat = await chatService.createChat(creator, {
        encryptedSymmetricKey: 'encryptedSymmetricKey',
        members: [],
      });
      expect(groupChat).toBeDefined();
      expect(groupChat.isPrivate).toBeTruthy();

      // delete group chat
      await chatService.delete(groupChat.id);

      // check if group chat was deleted
      const groupChat_ = await chatService.findOne(groupChat.id).catch(() => null);
      expect(groupChat_).toBeFalsy();
    });

    describe('create a public group chat', () => {
      let groupChat: GroupChat;
      beforeAll(async () => {
        const creator = profiles[0];
        groupChat = await chatService.createChat(creator, {
          encryptedSymmetricKey: 'encryptedSymmetricKey',
          name: 'test group chat',
          members: profiles.slice(1, 3).map(profile => ({
            encryptedSymmetricKey: 'encryptedSymmetricKey',
            id: profile.id,
          })),
        });
        expect(groupChat).toBeDefined();
        expect(groupChat.isPrivate).toBeFalsy();
      });

      it('should have one admin who is the creator', () => {
        const admins = groupChat.groupChatToProfiles.filter(groupChatToProfile => groupChatToProfile.isAdmin);
        expect(admins.length).toBe(1);
        expect(admins[0].profile.id).toBe(profiles[0].id);
      });

      it('should add a member to the group chat', async () => {
        const member = profiles[3];
        groupChat = await chatService.addMember(groupChat.id, member);
        expect(groupChat.groupChatToProfiles.length).toBe(4);
      });

      it('should remove a member from the group chat', async () => {
        const member = profiles[1];
        groupChat = await chatService.removeMember(groupChat.id, member);
        expect(groupChat.groupChatToProfiles.length).toBe(3);
      });

      it("shouldn't remove owner from the group chat", async () => {
        const owner = profiles[0];
        groupChat = await chatService.removeMember(groupChat.id, owner);
        expect(groupChat.groupChatToProfiles.length).toBe(3);
      });

      it('should update group chat', async () => {
        const name = 'new name';
        groupChat = await chatService.updateGroupChat({
          id: groupChat.id,
          name,
          newMembers: [
            {
              encryptedSymmetricKey: 'encryptedSymmetricKey',
              id: profiles[1].id,
            },
          ],
          removeMembers: [profiles[2].id, profiles[3].id],
        });
        expect(groupChat.name).toBe(name);
        expect(groupChat.groupChatToProfiles.length).toBe(2);
      });

      it('should allow a member to send a message', async () => {
        const member = profiles[1];
        const message = await chatService.sendMessage(
          {
            groupChatId: groupChat.id,
            text: 'Hello World',
          },
          member,
        );
        expect(message).toBeDefined();
        expect(message.data.text).toBe('Hello World');
      });

      afterAll(async () => {
        // delete group chat
        await chatService.delete(groupChat.id);

        // check if group chat was deleted
        const groupChat_ = await chatService.findOne(groupChat.id).catch(() => null);
        expect(groupChat_).toBeFalsy();
      });
    });
  });

  afterAll(async () => {
    await appModule.close();
  });
});
