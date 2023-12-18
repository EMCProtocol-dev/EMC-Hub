# EMC-Hub

```
$npm install
```

ethers.js throw 'missing v'

```typescript
const checkTx = async () => {
  // console.info('test');
  try {
    // Try getting the transaction
    const tx = await this.provider.getTransaction(hash);
    if (tx != null) {
      resolve(tx.replaceableTransaction(blockNumber));
      return;
    }
  } catch (error) {
    if (error.toString().includes('missing v')) {
    } else {
      reject(hash);
    }
  }
  // Wait another 4 seconds
  this.provider._setTimeout(() => {
    checkTx();
  }, timeouts.pop() || 4000);
};
```
