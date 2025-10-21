import { PrismaClient, PropertyType, DealType, PropertyStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Создаем тестовых пользователей
  const users = await Promise.all([
    prisma.user.upsert({
      where: { telegramId: 111111111n },
      update: {},
      create: {
        telegramId: 111111111n,
        username: 'david_cohen',
        firstName: 'David',
        lastName: 'Cohen',
        phone: '+972501234567',
        email: 'david@example.com',
        languageCode: 'he',
        isVerified: true,
        role: 'AGENT',
        rating: 4.8,
        reviewCount: 15,
      },
    }),
    prisma.user.upsert({
      where: { telegramId: 222222222n },
      update: {},
      create: {
        telegramId: 222222222n,
        username: 'sarah_levi',
        firstName: 'Sarah',
        lastName: 'Levi',
        phone: '+972507654321',
        email: 'sarah@example.com',
        languageCode: 'he',
        isVerified: true,
        role: 'USER',
        rating: 5.0,
        reviewCount: 8,
      },
    }),
    prisma.user.upsert({
      where: { telegramId: 333333333n },
      update: {},
      create: {
        telegramId: 333333333n,
        username: 'alex_petrov',
        firstName: 'Alex',
        lastName: 'Petrov',
        phone: '+972509876543',
        email: 'alex@example.com',
        languageCode: 'ru',
        isVerified: true,
        role: 'AGENT',
        rating: 4.5,
        reviewCount: 22,
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Создаем тестовые объявления
  const properties = await Promise.all([
    prisma.property.create({
      data: {
        ownerId: users[0].id,
        title: 'דירה מעוצבת בלב תל אביב',
        description: 'דירת 3 חדרים מרווחת ומעוצבת בלב העיר. קרוב לכל השירותים, תחבורה ציבורית ומסעדות. מושלם למשפחות או לזוגות.',
        type: PropertyType.APARTMENT,
        dealType: DealType.RENT,
        status: PropertyStatus.ACTIVE,
        address: 'Rothschild Blvd 50',
        city: 'Tel Aviv',
        district: 'Center',
        latitude: 32.0644,
        longitude: 34.7749,
        rooms: 3,
        bedrooms: 2,
        bathrooms: 1,
        area: 75,
        floor: 3,
        totalFloors: 5,
        price: 8500,
        currency: 'ILS',
        pricePerMonth: 8500,
        deposit: 17000,
        amenities: ['parking', 'elevator', 'balcony', 'air_conditioning', 'wifi'],
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
        ],
        availableFrom: new Date(),
        minRentDays: 30,
        publishedAt: new Date(),
      },
    }),
    prisma.property.create({
      data: {
        ownerId: users[0].id,
        title: 'Studio apartment near the beach',
        description: 'Cozy studio apartment just 5 minutes walk from the beach. Perfect for singles or couples. Recently renovated with modern amenities.',
        type: PropertyType.STUDIO,
        dealType: DealType.RENT,
        status: PropertyStatus.ACTIVE,
        address: 'Ben Yehuda St 120',
        city: 'Tel Aviv',
        district: 'North',
        latitude: 32.0853,
        longitude: 34.7818,
        rooms: 1,
        bedrooms: 1,
        bathrooms: 1,
        area: 35,
        floor: 2,
        totalFloors: 4,
        price: 5500,
        currency: 'ILS',
        pricePerMonth: 5500,
        deposit: 11000,
        amenities: ['air_conditioning', 'wifi', 'kitchen', 'washing_machine'],
        images: [
          'https://images.unsplash.com/photo-1536376072261-38c75010e6c9',
          'https://images.unsplash.com/photo-1493809842364-78817add7ffb',
        ],
        availableFrom: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // через неделю
        minRentDays: 30,
        publishedAt: new Date(),
      },
    }),
    prisma.property.create({
      data: {
        ownerId: users[2].id,
        title: 'Просторный пентхаус с видом на море',
        description: 'Роскошный пентхаус на последнем этаже с панорамным видом на Средиземное море. 4 спальни, 3 ванные комнаты, огромная терраса. Все удобства премиум-класса.',
        type: PropertyType.PENTHOUSE,
        dealType: DealType.RENT,
        status: PropertyStatus.ACTIVE,
        address: 'HaYarkon St 200',
        city: 'Tel Aviv',
        district: 'North',
        latitude: 32.0900,
        longitude: 34.7750,
        rooms: 5,
        bedrooms: 4,
        bathrooms: 3,
        area: 180,
        floor: 10,
        totalFloors: 10,
        price: 25000,
        currency: 'ILS',
        pricePerMonth: 25000,
        deposit: 50000,
        amenities: [
          'parking',
          'elevator',
          'balcony',
          'air_conditioning',
          'wifi',
          'pool',
          'gym',
          'security',
          'storage',
          'sea_view',
        ],
        images: [
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
        ],
        videoUrl: 'https://www.youtube.com/watch?v=example',
        availableFrom: new Date(),
        minRentDays: 90,
        publishedAt: new Date(),
      },
    }),
    prisma.property.create({
      data: {
        ownerId: users[2].id,
        title: 'חדר להשכרה בדירת שותפים',
        description: 'חדר פרטי בדירת 4 חדרים. דיירים נחמדים, אווירה נעימה. מטבח משותף מאובזר, אינטרנט מהיר, ליד תחבורה ציבורית.',
        type: PropertyType.ROOM,
        dealType: DealType.RENT,
        status: PropertyStatus.ACTIVE,
        address: 'Dizengoff St 123',
        city: 'Tel Aviv',
        district: 'Center',
        latitude: 32.0753,
        longitude: 34.7746,
        rooms: 1,
        bedrooms: 1,
        bathrooms: 1, // shared
        area: 15,
        floor: 4,
        totalFloors: 5,
        price: 3200,
        currency: 'ILS',
        pricePerMonth: 3200,
        deposit: 6400,
        amenities: ['wifi', 'air_conditioning', 'shared_kitchen', 'washing_machine'],
        images: [
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af',
          'https://images.unsplash.com/photo-1540518614846-7eded433c457',
        ],
        availableFrom: new Date(),
        minRentDays: 30,
        publishedAt: new Date(),
      },
    }),
    prisma.property.create({
      data: {
        ownerId: users[0].id,
        title: 'Luxury Villa for Sale in Herzliya',
        description: 'Magnificent villa in prestigious area. 6 bedrooms, 5 bathrooms, private pool, large garden. Close to the beach and international schools.',
        type: PropertyType.VILLA,
        dealType: DealType.SALE,
        status: PropertyStatus.ACTIVE,
        address: 'Hasharon St 45',
        city: 'Herzliya',
        district: 'Sharon',
        latitude: 32.1624,
        longitude: 34.8443,
        rooms: 7,
        bedrooms: 6,
        bathrooms: 5,
        area: 350,
        floor: 1,
        totalFloors: 2,
        price: 12500000,
        currency: 'ILS',
        amenities: [
          'parking',
          'garden',
          'pool',
          'air_conditioning',
          'wifi',
          'security',
          'storage',
          'bbq',
          'smart_home',
        ],
        images: [
          'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
          'https://images.unsplash.com/photo-1613977257363-707ba9348227',
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
        ],
        publishedAt: new Date(),
      },
    }),
  ]);

  console.log(`✅ Created ${properties.length} properties`);

  // Создаем избранное
  await prisma.favorite.create({
    data: {
      userId: users[1].id,
      propertyId: properties[0].id,
    },
  });

  await prisma.favorite.create({
    data: {
      userId: users[1].id,
      propertyId: properties[2].id,
    },
  });

  console.log('✅ Created favorites');

  // Создаем отзывы
  await prisma.review.create({
    data: {
      authorId: users[1].id,
      targetId: users[0].id,
      propertyId: properties[0].id,
      rating: 5,
      comment: 'Excellent landlord! Very responsive and professional. The apartment is exactly as described.',
      cleanRating: 5,
      locationRating: 5,
      communicationRating: 5,
      isVerified: true,
    },
  });

  await prisma.review.create({
    data: {
      authorId: users[1].id,
      targetId: users[2].id,
      rating: 4,
      comment: 'Good experience overall. Quick responses and fair pricing.',
      communicationRating: 5,
      isVerified: false,
    },
  });

  console.log('✅ Created reviews');

  console.log('✨ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
