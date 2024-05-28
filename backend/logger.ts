import pino from 'pino';
import * as Config from './config/config';

// The logger may be invoked like so:
//  logger.<method>(obj, [msg], [msg params])
//  logger.<method>(msg, [msg params]);
// where:
//   - msg = printf-style message string
//   - msg-params = replacement parameters for msg string (%o, %s, %d, etc)
const logger = pino({
  level: Config.instance().debug ? 'trace' : 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      async: true,
    },
  },
});

export default logger;
