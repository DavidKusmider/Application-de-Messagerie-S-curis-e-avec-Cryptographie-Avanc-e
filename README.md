# Hertz
> Projet scolaire de messagerie instantanée avec cryptographie avancée

Hertz est une application de messagerie sécurisée avec une cryptographie avancée. Les messages sont chiffrés en utilisant des règles de cryptographie asymétrique (paires de clés privées/publiques RSA, AES, SHA256).

## Cryptographie

Le code lié à la cryptographie est situé dans [cryptoUtils.ts](./src/utils/cryptoUtils.ts). Il utilise des règles de chiffrement asymétrique avec des paires de clés privées/publiques, ainsi que les algorithmes RSA, AES et SHA256.

## Fonctionnalités Principales

- [socket.js](./socket.js) : Fichier contenant le code serveur et le code lié à socket.io pour la gestion des sockets.
- [cryptoUtils.ts](./src/utils/cryptoUtils.ts) : Fichier contenant le code lié à la cryptographie.

### Authentification

- [Accueil](./src/app/page.tsx) : Page d'accueil de la plateforme, fonctionnalités d'authentification

### Conversations

- [Conversations](./src/app/conversations) : Dossier contenant les composants et les actions liés aux conversations.

### Amis

- [Friends](./src/app/friends) : Dossier contenant les composants et les actions liés à la gestion des amis.

## Clonage du repository et initialisation

- Cloner le repository localement (HTTPS ou SSH)
- Télécharger les paquetages nodes. Pour ceci, utiliser cette commande à la racine du projet (à l'emplacement du dossier node_modules) :

```bash
npm install
```

## Construction et Exécution

Pour exécuter l'instance Next (serveur et client), utilisez la commande :

```bash
node socket.js
```

## Contributeurs

- Romain Barré
- Lucas Guillot
- David Kusmider
- Nicolas Mendy ([LinkedIn](https://www.linkedin.com/in/nicolas--dubois/) - [Mail : mendynicol@cy-tech.fr](mailto:mendynicol@cy-tech.fr))
- Ethan Orsolle
