# Medivh -- the guardian of the Azeroth
### 开发步骤

1. 初始化项目

    ```bash
    docker run --rm -v $(pwd)/petstore:/apps blocky/truffle unbox pet-shop
    ```
2. 编写智能合约
在生成的目录中包含contracts 目录，这个目录里会有一个Migration.sol的智能合约。Migration.sol 后续的应用的智能合约发生变化的时候，完成相应的迁移工作。在migrations 目录里有 ```1_initial_migration.js``` 用来部署Migration.sol。
3. 部署智能合约
编写相应的迁移脚本。如 2_deploy_contracts.js
4. 配置truffle(truffle.js)

    ```javascript
    module.exports = {
      // See <http://truffleframework.com/docs/advanced/configuration>
      // for more about customizing your Truffle configuration!
      networks: {
        development: {
          host: "127.0.0.1",
          port: 8545,
          network_id: "*" // Match any network id
          // optional config values:
          // gas
          // gasPrice
          // from - default address to use for any transaction Truffle makes during migrations
          // provider - web3 provider instance Truffle should use to talk to the Ethereum network.
          //          - function that returns a web3 provider instance (see below.)
          //          - if specified, host and port are ignored.
        }
      }
    };
    ```
    需要指定访问的ethereum 节点的rpc 地址，可以启动一个测试的以太坊节点

    ```bash
    docker run --rm -it -v $(pwd)/ethereum/data:/ethereum/data:rw \
           -v $(pwd)/ethereum/ethash:/ethereum/ethash:rw \
           tzion/peer geth --networkid=331788 --datadir=/ethereum/data --ethash.dagdir=/ethereum/ethash account new
    # we have the address 0xadf7ad4985fa697c07802a94cdb001fda7eb3efe
    docker run -d --name=truffle-server -v $(pwd)/ethereum/data:/ethereum/data:rw \
                 -v $(pwd)/ethereum/ethash:/ethereum/ethash:rw \-p 8545:8545/tcp -p 8545:8545/udp \
                 -p 30303:30303/tcp -p 30303:30303/udp \
                 --cpus=0.5 \
                 tzion/peer geth --networkid=331788 \
                 --datadir=/ethereum/data \
                 --ethash.dagdir=/ethereum/ethash \
                 --rpc --rpcaddr="0.0.0.0" --rpcapi="db,eth,net,web3,personal" \
                 --rpccorsdomain="*" --cache=200 --verbosity=4 --port=30303 --mine --minerthreads=1
    ```
5. 解锁account

    ```bash
    docker exec -it truffle-server geth --datadir=/ethereum/data attach --exec 'personal.unlockAccount("0xadf7ad4985fa697c07802a94cdb001fda7eb3efe", "password")'
    # 密码为password
    ```
6. 运行迁移脚本
    
    ```bash
    docker run --rm -it -v $(pwd):/apps blocky/truffle migrate
    ```