import Gateway from '../../classes/gateway.class';

class LiveGateway extends Gateway {
  protected onListening(): void {
    console.log('Gateway listening');
  }
}

export default LiveGateway;
