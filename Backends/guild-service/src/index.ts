import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { bearer } from '@elysiajs/bearer';
import mongoose from 'mongoose';
import { Guild, Channel, Role, GuildMember, Invite } from './models';

const PORT = parseInt(process.env.GUILD_SERVICE_PORT || '3003');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:discord_admin_pass@localhost:27017/discord?authSource=admin';

await mongoose.connect(MONGODB_URI);
console.log('✅ MongoDB connected');

const app = new Elysia()
  .use(cors())
  .use(bearer())
  .use(swagger({ documentation: { info: { title: 'Guild Service API', version: '1.0.0' } } }))
  
  .get('/health', () => ({ status: 'ok', service: 'guild-service' }))
  
  .get('/guilds', async ({ bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    const userId = 'user_from_token';
    const members = await GuildMember.find({ userId: new mongoose.Types.ObjectId(userId) });
    const guildIds = members.map(m => m.guildId);
    return await Guild.find({ _id: { $in: guildIds } });
  })
  
  .post('/guilds', async ({ body, bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    const userId = 'user_from_token';
    const guild = await Guild.create({ ...body, ownerId: new mongoose.Types.ObjectId(userId) });
    await GuildMember.create({ guildId: guild._id, userId: new mongoose.Types.ObjectId(userId) });
    return guild;
  }, { 
    body: t.Object({ 
      name: t.String(), 
      description: t.Optional(t.String()) 
    }) 
  })
  
  .get('/guilds/:guildId', async ({ params: { guildId } }) => {
    return await Guild.findById(guildId);
  })
  
  .patch('/guilds/:guildId', async ({ params: { guildId }, body, bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    return await Guild.findByIdAndUpdate(guildId, body, { new: true });
  }, { 
    body: t.Object({ 
      name: t.Optional(t.String()), 
      description: t.Optional(t.String()) 
    }) 
  })
  
  .delete('/guilds/:guildId', async ({ params: { guildId }, bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    await Guild.findByIdAndDelete(guildId);
    return { success: true };
  })
  
  .get('/guilds/:guildId/channels', async ({ params: { guildId } }) => {
    return await Channel.find({ guildId: new mongoose.Types.ObjectId(guildId) }).sort('position');
  })
  
  .post('/guilds/:guildId/channels', async ({ params: { guildId }, body, bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    return await Channel.create({ ...body, guildId: new mongoose.Types.ObjectId(guildId) });
  }, { 
    body: t.Object({ 
      name: t.String(), 
      type: t.Union([t.Literal('text'), t.Literal('voice'), t.Literal('category')]) 
    }) 
  })
  
  .patch('/guilds/:guildId/channels/:channelId', async ({ params: { channelId }, body, bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    return await Channel.findByIdAndUpdate(channelId, body, { new: true });
  }, { 
    body: t.Object({ 
      name: t.Optional(t.String()), 
      topic: t.Optional(t.String()) 
    }) 
  })
  
  .delete('/guilds/:guildId/channels/:channelId', async ({ params: { channelId }, bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    await Channel.findByIdAndDelete(channelId);
    return { success: true };
  })
  
  .get('/guilds/:guildId/roles', async ({ params: { guildId } }) => {
    return await Role.find({ guildId: new mongoose.Types.ObjectId(guildId) }).sort('position');
  })
  
  .post('/guilds/:guildId/roles', async ({ params: { guildId }, body, bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    return await Role.create({ ...body, guildId: new mongoose.Types.ObjectId(guildId) });
  }, { 
    body: t.Object({ 
      name: t.String(), 
      color: t.Optional(t.String()) 
    }) 
  })
  
  .get('/guilds/:guildId/members', async ({ params: { guildId } }) => {
    return await GuildMember.find({ guildId: new mongoose.Types.ObjectId(guildId) }).populate('userId');
  })
  
  .get('/guilds/:guildId/invites', async ({ params: { guildId } }) => {
    return await Invite.find({ guildId: new mongoose.Types.ObjectId(guildId) });
  })
  
  .post('/guilds/:guildId/invites', async ({ params: { guildId }, body, bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    const userId = 'user_from_token';
    const code = Math.random().toString(36).substring(2, 10);
    return await Invite.create({
      code,
      guildId: new mongoose.Types.ObjectId(guildId),
      channelId: new mongoose.Types.ObjectId(body.channelId),
      inviterId: new mongoose.Types.ObjectId(userId),
      maxUses: body.maxUses || 0,
    });
  }, { 
    body: t.Object({ 
      channelId: t.String(), 
      maxUses: t.Optional(t.Number()) 
    }) 
  })
  
  .post('/invites/:code', async ({ params: { code }, bearer }) => {
    if (!bearer) return { error: 'Unauthorized' };
    const userId = 'user_from_token';
    const invite = await Invite.findOne({ code });
    if (!invite) return { error: 'Invalid invite' };
    await GuildMember.create({ 
      guildId: invite.guildId, 
      userId: new mongoose.Types.ObjectId(userId) 
    });
    await Invite.findByIdAndUpdate(invite._id, { $inc: { uses: 1 } });
    return { success: true, guildId: invite.guildId };
  })
  
  .listen(PORT);

console.log(`🦊 Guild Service running at http://${app.server?.hostname}:${app.server?.port}`);
