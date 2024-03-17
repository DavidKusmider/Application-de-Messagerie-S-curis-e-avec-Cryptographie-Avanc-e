# Hertz
> Projet scolaire de messagerie instantanée avec cryptographie avancée

Hertz est une application de messagerie sécurisée avec une cryptographie avancée. Les messages sont chiffrés en utilisant des règles de cryptographie asymétrique (paires de clés privées/publiques RSA, AES, SHA256).

## Cryptographie

Le code lié à la cryptographie est situé dans [cryptoUtils.js](./src/utils/cryptoUtils.js). Il utilise des règles de chiffrement asymétrique avec des paires de clés privées/publiques, ainsi que les algorithmes RSA, AES et SHA256.

## Fonctionnalités Principales

- [socket.ts](./socket.ts) : Fichier contenant le code serveur et le code lié à socket.io pour la gestion des sockets.
- [cryptoUtils.js](./src/utils/cryptoUtils.js) : Fichier contenant le code lié à la cryptographie.

### Authentification

- [connexion](./src/app/connexion) : Dossier contenant les composants et les actions liés à l'authentification des utilisateurs.

### Conversations

- [conversations](./src/app/conversations) : Dossier contenant les composants et les actions liés aux conversations.

### Amis

- [friends](./src/app/friends) : Dossier contenant les composants et les actions liés à la gestion des amis.

## Construction et Exécution

Pour compiler le fichier `socket.ts`, exécutez :

```bash
npx tsc --esModuleInterop true socket.ts
```

Pour exécuter le serveur, utilisez la commande :

```bash
node socket.js
```

Pour exécuter le client, utilisez la commande :

```bash
npm run dev
```

## Contributeurs

- Romain Barré
- Lucas Guillot
- David Kusmider
- Nicolas Mendy ([LinkedIn](https://www.linkedin.com/in/nicolas--dubois/) - [Mail : mendynicol@cy-tech.fr](mailto:mendynicol@cy-tech.fr))
- Ethan Orsolle